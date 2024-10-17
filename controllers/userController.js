const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const mongoose = require("mongoose");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone, fullname, role } = req.body;

  if (!username || !email || !password || !phone || !fullname || !role) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const userAvailable = await User.findOne({ email });

  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  const verificationToken = crypto.randomBytes(20).toString("hex");

  const url = process.env.NODE_ENV_URL;

  const html = `<p>Please click <a href="${url}/api/V1/user/verify/${verificationToken}">here</a> to verify your email address.</p>`;

  const subject = "Account Verification";

  sendEmail(email, subject, html);

  // Hash password
  const hashedpassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullname,
    username,
    email,
    password: hashedpassword,
    role,
    phone,
    verificationToken,
  });

  if (user) {
    res.status(201).json({ _id: user._id, email: user.email, role: user.role });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("user does not exist");
  }

  if (!user.verified) {
    res.status(401);
    throw new Error("email is not verified");
  }

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          _id: user._id,
          role: user.role,
          email: user.email,
          fullname: user.fullname,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
    });
    req.session.user = {
      user: {
        _id: user._id,
        role: user.role,
        email: user.email,
        fullname: user.fullname,
      },
    };
    res.status(200).json({
      user: {
        _id: user._id,
        role: user.role,
        email: user.email,
        fullname: user.fullname,
      },
    });
  } else {
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500);
      throw new Error("Logout failed");
    }
  });
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

const currentUser = asyncHandler(async (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401);
    throw new Error("Not logged in");
  }
});

const emailVerification = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ verificationToken: token });
  if (!user) {
    res.status(404);
    throw new Error("Verification token is invalid.");
  }
  await User.findByIdAndUpdate(
    user._id,
    {
      verified: true,
      verificationToken: null,
    },
    { new: true }
  );

  res.status(200).redirect(`${process.env.FRONTEND_BASE_URI}/login`);
});

const getUserData = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  const user = await User.findById(id)
    .select("-password -verificationToken") // Exclude these fields
    .populate("donationHistory") // Populate donationHistory field
    .populate("savedCampaigns"); // Populate savedCampaigns field

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  emailVerification,
  getUserData,
};
