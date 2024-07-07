const mongoose = require("mongoose");

const campaignSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    image: {
      public_id: {
        type: String,
        default: "zqef8awx7nkoz4qzto19",
      },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dzr31apfk/image/upload/v1717608010/zqef8awx7nkoz4qzto19.jpg",
      },
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    goalAmount: {
      type: Number,
      required: true,
    },
    currentAmount: {
      type: Number,
      default: 0,
    },
    tags: [String],
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Campaign", campaignSchema);
