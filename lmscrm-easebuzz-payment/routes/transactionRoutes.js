const express = require("express");
const router = express.Router();

const { transactionSaved, transactionsList } = require('../helpers/transaction');

router.post("/transaction-saved", async (req, res) => {

  const { information } = req.body;

  const result = await transactionSaved(information);

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      message: "Email sending failed"
    });
  }

});

router.get("/transactions/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const transactions = await transactionsList(id);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to retrieve transactions"
    });
  }
});

module.exports = router;
