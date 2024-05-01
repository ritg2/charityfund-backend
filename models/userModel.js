const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: [true, "Username is required"] },
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
  },
  {
    timestamps: true,
  }
);

module.exports  = mongoose.model("User", userSchema)