const express = require("express");
const {
  getAllComments,
  createComment,
  deleteComment,
  updateComment,
  getCommentReplies,
} = require("../controllers/commentController");
const validateToken = require("../middleware/validateToken");

const router = express.Router();

router
  .route("/:id/comments")
  .get(getAllComments)
  .post(validateToken, createComment)
  .put(validateToken, updateComment)
  .delete(validateToken, deleteComment);

router.route("/:id/comments/:commentid", getCommentReplies)

module.exports = router;
