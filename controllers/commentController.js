const asyncHandler = require("express-async-handler");
const Comment = require("../models/commentModel");

const createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) {
    res.status(400);
    throw new Error("No comment");
  }
  const comment = await Comment.create({
    text,
    user_id: req.user._id,
    compaign_id: "",
  });

  res.status(201).json(comment);
});

const getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find();
  res.status(201).json(comments);
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  if (comment.user_id.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User don't have permission to update other user Comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(201).json(updatedComment);
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  if (comment.user_id.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User don't have permission to delete other user Comment");
  }

  await Comment.delete({ _id: req.params.id });

  res.status(201).json(comment);
});

module.exports = {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
};
