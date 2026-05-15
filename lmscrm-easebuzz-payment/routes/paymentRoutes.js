const express = require("express");
const router = express.Router();
const { sequelize } = require("../db");
const sha512 = require("js-sha512");

const initiate_payment = require("../helpers/initiate_payment");

const apiUrl = process.env.API_URL;
const easeBuzzEnv = process.env.EASEBUZZ_ENV;
const crmUrl = process.env.CRM_URL;

const config = {
  key: process.env.EASEBUZZ_KEY,
  salt: process.env.EASEBUZZ_SALT,
  env: process.env.EASEBUZZ_ENV,
  enable_iframe: process.env.EASEBUZZ_IFRAME,
};

router.post("/easebuzz/initiate_payment", (req, res) => {

  console.log("Initiating payment...", req.body);

  const data = req.body;
  initiate_payment.initiate_payment(data, config, res);

});

router.post("/payment-success", async (req, res) => {

  try {

    const data = req.body;

    const hashString =
      config.salt + "|" +
      data.status +
      "|||||||||||" +
      data.email + "|" +
      data.firstname + "|" +
      data.productinfo + "|" +
      data.amount + "|" +
      data.txnid + "|" +
      config.key;

    const calculatedHash = sha512.sha512(hashString);

    if (calculatedHash !== data.hash) {
      return res.status(400).json({
        success: false,
        message: "Hash verification failed"
      });
    }

    const [transaction] = await sequelize.query(
      `SELECT * FROM accounting_transaction WHERE transaction_id = :txnid`,
      {
        replacements: { txnid: data.txnid },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    if (data.status === "success") {

      await sequelize.query(
        `UPDATE accounting_transaction 
         SET status = 'PAID'
         WHERE transaction_id = :txnid`,
        {
          replacements: {
            txnid: data.txnid
          }
        }
      );

      return res.redirect(
        `${crmUrl}/payment?success=true&txnid=${data.txnid}`
      );

    } else {

      return res.redirect(
        `${crmUrl}/payment?success=false&txnid=${data.txnid}`
      );

    }

  } catch (error) {

    console.error("Payment verification error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });

  }

});

router.post("/payment-failure", async (req, res) => {

  try {

    const data = req.body;

    const hashString =
      config.salt + "|" +
      data.status +
      "|||||||||||" +
      data.email + "|" +
      data.firstname + "|" +
      data.productinfo + "|" +
      data.amount + "|" +
      data.txnid + "|" +
      config.key;

    const calculatedHash = sha512.sha512(hashString);

    if (calculatedHash !== data.hash) {
      return res.status(400).json({
        success: false,
        message: "Invalid hash. Payment verification failed."
      });
    }

    // Check transaction exists
    const [transaction] = await sequelize.query(
      `SELECT * FROM accounting_transaction WHERE transaction_id = :txnid`,
      {
        replacements: { txnid: data.txnid },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    // Update status to failed
    await sequelize.query(
      `UPDATE accounting_transaction
       SET status = 'FAILED',
           last_updated = NOW()
       WHERE transaction_id = :txnid`,
      {
        replacements: { txnid: data.txnid }
      }
    );

    // Redirect user back to frontend
    return res.redirect(
      `${crmUrl}/payment?success=false&txnid=${data.txnid}`
    );

  } catch (error) {

    console.error("Payment failure handler error:", error);

    return res.status(500).json({
      success: false,
      message: "Payment failure processing failed"
    });

  }

});

router.get("/pay/:leadId/:transactionId", async (req, res) => {

  const { leadId, transactionId } = req.params;

  if (!leadId || !transactionId) {
    return res.status(400).json({
      success: false,
      message: "Invalid request"
    });
  }

  try {

    // Fetch student details
    const [student] = await sequelize.query(
      `SELECT
        lead_id,
        MAX(value) FILTER (WHERE code = 'full_name') AS full_name,
        MAX(value) FILTER (WHERE code = 'email') AS email,
        MAX(value) FILTER (WHERE code = 'phone') AS phone
      FROM public.lead_management_leadformvalue
      WHERE lead_id = :leadId
      GROUP BY lead_id`,
      {
        replacements: { leadId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found"
      });
    }

    // Fetch transaction
    const [transaction] = await sequelize.query(
      `SELECT * FROM accounting_transaction
       WHERE lead_id = :leadId AND transaction_id = :transactionId`,
      {
        replacements: { leadId, transactionId },
        type: sequelize.QueryTypes.SELECT
      }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found"
      });
    }

    // Prepare payment data
    const data = {
      txnid: transaction.transaction_id,
      amount: Number(transaction.amount).toFixed(2),
      firstname: student.full_name,
      email: student.email,
      phone: student.phone,
      productinfo: "Package Payment"
    };

    // Generate hash
    const hashString =
      process.env.EASEBUZZ_KEY + "|" +
      data.txnid + "|" +
      data.amount + "|" +
      data.productinfo + "|" +
      data.firstname + "|" +
      data.email +
      "|||||||||||" +
      process.env.EASEBUZZ_SALT;

    const hash = sha512.sha512(hashString);

    // Build payload
    const payload = new URLSearchParams({
      key: process.env.EASEBUZZ_KEY,
      txnid: data.txnid,
      amount: data.amount,
      firstname: data.firstname,
      email: data.email,
      phone: data.phone,
      productinfo: data.productinfo,
      surl: `${apiUrl}/payment-success`,
      furl: `${apiUrl}/payment-failure`,
      hash
    });

    const easeBuzzUrl = easeBuzzEnv === "test" ? "https://testpay.easebuzz.in/payment/initiateLink" : "https://pay.easebuzz.in/payment/initiateLink";
    const easeBuzzAccessUrl = easeBuzzEnv === "test" ? "https://testpay.easebuzz.in/v2/pay/" : "https://pay.easebuzz.in/v2/pay/";

    // Call Easebuzz
    const response = await fetch(
      easeBuzzUrl,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: payload.toString()
      }
    );

    const result = await response.json();

    if (!result.status) {
      return res.status(400).json(result);
    }

    const accessKey = result.data;

    // Redirect user to payment page
    res.redirect(`${easeBuzzAccessUrl}${accessKey}`);

  } catch (error) {

    console.error("Payment initialization error:", error);

    res.status(500).json({
      success: false,
      message: "Payment initialization failed"
    });

  }

});

module.exports = router;
