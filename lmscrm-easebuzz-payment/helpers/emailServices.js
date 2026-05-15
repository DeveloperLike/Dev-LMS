const nodemailer = require("nodemailer");
const fs = require('fs')
const path = require('path');

let template = fs.readFileSync(
  path.join(__dirname, "./paymentEmailTemplate.html"),
  "utf8"
);

const InfoMailTransporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    },
    tls: {
        rejectUnauthorized: false
    }
})

const sendEmail = async (to, subject, information) => {

  try {

    let emailTemplate = template;

    emailTemplate = emailTemplate
      .replace("{{name}}", information.name)
      .replace("{{transaction_id}}", information.transaction_id)
      .replace("{{amount}}", information.amount)
      .replace("{{date}}", new Date().toLocaleDateString())
      .replace("{{website_link}}", "https://yesgermany.com")
      .replace("{{year}}", new Date().getFullYear())
      .replace("{{payment_url}}", information.payment_url);

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to,
      subject,
      html: emailTemplate
    };

    const info = await InfoMailTransporter.sendMail(mailOptions);

    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error("Email error:", error);

    return {
      success: false,
      error
    };
  }
};

module.exports = { sendEmail };
