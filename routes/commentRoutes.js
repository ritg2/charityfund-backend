const express = require("express");
const {
  getAllComments,
  createComment,
  deleteComment,
} = require("../controllers/commentController");
const validateToken = require("../middleware/validateToken");
const { updateCampaign } = require("../controllers/campaignController");

const router = express.Router();

router.route("/").get(getAllComments).post(validateToken, createComment);

router
  .route("/:id")
  .delete(validateToken, deleteComment)
  .put(validateToken, updateCampaign);

module.exports = router;
