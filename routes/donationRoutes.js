const express = require("express");
const {
  createDonation,
  verifyDonation,
  getDonation,
} = require("../controllers/donationController");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

router.route("/").post(validateToken, createDonation);
router.route("/receipt").get(validateToken, getDonation);

module.exports = router;
