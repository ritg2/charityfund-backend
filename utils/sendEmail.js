const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const sendEmail = (email, subject, html) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ritking2@gmail.com",
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "ritking2@gmail.com",
    to: email,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.error("Error sending email:", error);
      throw new Error("problem sending email");
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

module.exports = sendEmail;
