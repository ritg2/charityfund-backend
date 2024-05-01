const express = require("express");
const createDonation = require("../controllers/donationController");

const router = express.Router()

router.route("/").post(createDonation)

module.exports = router;