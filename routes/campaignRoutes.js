const express = require("express");

const {
  createCampaign,
  getAllCampaigns,
  updateCampaign,
  deleteCampaign,
  getCampaign,
} = require("../controllers/campaignController");
const validateToken = require("../middleware/validateToken");
const upload = require("../middleware/multer");

const router = express.Router();

router.route("/").get(getAllCampaigns).post(validateToken,upload.single("image"),createCampaign);

router
  .route("/:id")
  .get(getCampaign)
  .put(validateToken, updateCampaign)
  .delete(validateToken, deleteCampaign);

module.exports = router;
