const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    campaign_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Campaign",
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
