const asyncHandler = require("express-async-handler");
const Comment = require("../models/commentModel");
const mongoose = require("mongoose");

const createComment = asyncHandler(async (req, res) => {
  const { content, parentComment } = req.body;
  if (!content) {
    res.status(400);
    throw new Error("No comment");
  }
  let comment = await Comment.create({
    content,
    user_id: req.user._id,
    campaign_id: req.params.id,
    parentComment,
  });

  comment = await comment.populate({
    path: "user_id",
    select: "username profile_picture",
  });

  res.status(201).json(comment);
});

const getAllComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const campaignId = req.params.id;

  if (!campaignId) {
    res.status(400);
    throw new Error("CampaignId is required");
  }

  // const comments = await Comment.aggregate([
  //   {
  //     $match: {
  //       campaign_id: new mongoose.Types.ObjectId(campaignId),
  //       parentComment: null,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: "comments",
  //       localField: "_id",
  //       foreignField: "parentComment",
  //       as: "replies",
  //     },
  //   },
  //   { $sort: { createdAt: -1 } },
  //   { $skip: (Number(page) - 1) * Number(limit) },
  //   { $limit: Number(limit) },
  // ]).catch((error) => {
  //   console.error("Aggregation error:", error);
  // });

  const comments = await Comment.find({
    campaign_id: campaignId,
    parentComment: null,
  })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate({ path: "user_id", select: "username profile_picture" });

  const totalComments = await Comment.countDocuments({
    campaign_id: campaignId,
    parentComment: null,
  });

  // const commentIds = comments.map((comment) => comment._id.toString());

  // const replies = await Comment.find({
  //   parentComment: { $in: commentIds },
  // }).lean();

  // comments.forEach((comment) => {
  //   comment.replies = replies.filter(
  //     (reply) => reply.parentComment.toString() === comment._id.toString()
  //   );
  // });

  res.status(200).json({
    comments,
    currentPage: Number(page),
    totalPages: Math.ceil(Number(totalComments) / Number(limit)),
  });
});

const getCommentReplies = asyncHandler(async (req, res) => {
  const { commentid } = req.params;
  const { limit = 10, page = 1 } = req.params;

  if (!commentid) {
    res.status(400);
    throw new Error("invalid comment id");
  }

  const replies = await Comment.find({ parentComment: commentid })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit))
    .populate({ path: "user_id", select: "username profile_picture" });

  const totalReplies = await Comment.countDocuments({
    parentComment: commentid,
  });

  res.status(200).json({
    replies,
    currentPage: Number(page),
    totalPages: Math.ceil(Number(totalReplies) / Number(limit)),
  });
});

const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.body.comment);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  if (comment.user_id.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User don't have permission to update other user Comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    req.query.comment,
    req.body,
    { new: true }
  );

  res.status(201).json(updatedComment);
});

const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.body.comment);
  if (!comment) {
    res.status(404);
    throw new Error("Comment not found");
  }

  if (comment.user_id.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User don't have permission to delete other user Comment");
  }

  const deletedComment = await Comment.findOneAndDelete({
    _id: req.query.comment,
  });

  res.status(201).json(deletedComment);
});

module.exports = {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
  getCommentReplies,
};
