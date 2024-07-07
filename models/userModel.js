const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: [true, "Username is required"] },
    fullname: { type: String, required: [true, "Fullname is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: { type: String, required: [true, "password is required"] },
    phone: {
      type: String,
      required: [true, "Please add phone number"],
    },
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    profile_picture: {
      public_id: {
        type: String,
        default: "PngItem_307416_yy94m5",
      },
      url: {
        type: String,
        default:
          "https://res.cloudinary.com/dzr31apfk/image/upload/PngItem_307416_yy94m5.png",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
