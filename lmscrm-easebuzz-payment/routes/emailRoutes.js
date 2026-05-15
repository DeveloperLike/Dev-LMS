const express = require("express");
const router = express.Router();

const { sendEmail } = require("../helpers/emailServices");

router.post("/send-mail", async (req, res) => {

  const { to, subject, information } = req.body;

  const result = await sendEmail(to, subject, information);

  if (result.success) {
    res.json(result);
  } else {
    res.status(500).json({
      success: false,
      message: "Email sending failed"
    });
  }

});

module.exports = router;
