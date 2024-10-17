const express = require("express");

const {
  createCampaign,
  getAllCampaigns,
  updateCampaign,
  deleteCampaign,
  getCampaign,
  saveCampaign,
  unsaveCampaign,
} = require("../controllers/campaignController");

const {
  updateImage,
  uploadImage,
  deleteImage,
} = require("../controllers/imageController");

const validateToken = require("../middleware/validateToken");
const upload = require("../middleware/multer");

const router = express.Router();

router.route("/").get(getAllCampaigns).post(validateToken, createCampaign);

router
  .route("/:id")
  .get(getCampaign)
  .put(validateToken, updateCampaign)
  .delete(validateToken, deleteCampaign);

router.route("/:id/save").post(validateToken, saveCampaign);
router.route("/:id/unsave").post(validateToken, unsaveCampaign);

router
  .route("/:id/image")
  .post(validateToken, upload.single("image"), uploadImage)
  .put(validateToken, upload.single("image"), updateImage)
  .delete(validateToken, deleteImage);

module.exports = router;
