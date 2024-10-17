const express = require("express");
const {
  createDonation,
  getDonation,
  getAllDonations,
} = require("../controllers/donationController");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

router.route("/").get(getAllDonations).post(validateToken, createDonation);
router.route("/receipt").get(validateToken, getDonation);

module.exports = router;
