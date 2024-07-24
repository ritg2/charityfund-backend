const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();

const verifyEmail = (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "ritking2@gmail.com",
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const url =
    process.env.NODE_ENV === "production"
      ? "https://ritg2-crownfund-backend-node.onrender.com"
      : "http://localhost:5001";

  const mailOptions = {
    from: "ritking2@gmail.com",
    to: email,
    subject: "Account Verification",
    html: `<p>Please click <a href="${url}/api/V1/user/verify/${verificationToken}">here</a> to verify your email address.</p>`,
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

module.exports = verifyEmail;
