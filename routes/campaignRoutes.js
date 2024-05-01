const express = require("express");

const {
  createCampaign,
  getAllCampaigns,
  updateCampaign,
  deleteCampaign,
  getCampaign,
} = require("../controllers/campaignController");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

router.route("/").get(getAllCampaigns).post(validateToken, createCampaign);

router
  .route("/:id")
  .get(getCampaign)
  .put(validateToken, updateCampaign)
  .delete(validateToken, deleteCampaign);

module.exports = router;
