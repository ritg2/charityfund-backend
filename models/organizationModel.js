const mongoose = require("mongoose");

const ngoSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organizationName: {
      type: String,
      required: true,
    },
    missionStatement: {
      type: String,
    },
    logoUrl: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    campaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
    status: {
      type: String,
      enum: ["approved", "pending", "denied"],
      default: "pending",
    },
    casCertificate: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Organization", ngoSchema);
