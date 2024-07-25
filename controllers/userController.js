const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const verifyEmail = require("../utils/verifyEmail");
const mongoose = require("mongoose");
const { lookup } = require("dns");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, phone, fullname } = req.body;

  if (!username || !email || !password || !phone || !fullname) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const userAvailable = await User.findOne({ email });

  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  const verificationToken = crypto.randomBytes(20).toString("hex");

  verifyEmail(email, verificationToken);

  // Hash password
  const hashedpassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullname,
    username,
    email,
    password: hashedpassword,
    phone,
    verificationToken,
  });

  if (user) {
    res.status(201).json({ _id: user._id, email: user.email });
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
          username: user.username,
          email: user.email,
          _id: user._id,
          fullname: user.fullname,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    res.cookie("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });
    req.session.user = {
      user: {
        username: user.username,
        email: user.email,
        _id: user._id,
        fullname: user.fullname,
      },
    };
    res.status(200).json({ message: "Logged in successfully" });
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

  // const user = await User.findById(id).select("fullname username email phone");

  const user = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "campaigns",
        localField: "_id",
        foreignField: "user_id",
        as: "campaigns",
      },
    },
    {
      $project: {
        _id: 1,
        fullname: 1,
        username: 1,
        email: 1,
        phone: 1,
        profile_picture: 1,
        createdAt: 1,
        noOfCampaigns: { $size: "$campaigns" },
      },
    },
  ]);

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
