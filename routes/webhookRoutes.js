const express = require("express");
const { verifyDonation } = require("../controllers/webhookController");

const router = express.Router();

router.post(
  "/paystack",
  express.raw({ type: "application/json" }),
  verifyDonation
);

module.exports = router;