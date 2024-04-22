const express = require("express");
const dotenv = require("dotenv");

const {
  createCampaign,
  getAllCampaigns,
  updateCampaign,
  deleteCampaign,
  getCampaign,
} = require("../controllers/campaignController");

const router = express.Router();

router.route("/").get(getAllCampaigns).post(createCampaign);

router.route("/:id").get(getCampaign).put(updateCampaign).delete(deleteCampaign);

module.exports = router;
