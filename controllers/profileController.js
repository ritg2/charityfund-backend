const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const cloudinary = require("../utils/cloudinary");

const uploadProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }

  if (user._id.toString() !== req.user._id) {
    res.status(401);
    throw new Error(
      "User don't have permission to update other user profile picture"
    );
  }

  const result = await cloudinary.uploader.upload(req.file.path);
  if (!result) {
    res.status(400);
    throw new Error("Failed to upload profile picture.");
  }

  await User.findByIdAndUpdate(
    req.params.id,
    {
      profile_picture: { public_id: result.public_id, url: result.secure_url },
    },
    { new: true }
  );

  res.status(201).json({
    status: "Success",
    message: "Succesfully uploaded profile picture",
  });
});

const updateProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }

  if (user._id.toString() !== req.user._id) {
    res.status(401);
    throw new Error(
      "User don't have permission to update other user profile picture"
    );
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    public_id: user.public_id,
    overwrite: true,
  });

  if (!result) {
    res.status(400);
    throw new Error("Failed to update profile picture.");
  }

  await User.findByIdAndUpdate(
    req.params.id,
    {
      profile_picture: { public_id: result.public_id, url: result.secure_url },
    },
    { new: true }
  );

  res.status(201).json({
    status: "Success",
    message: "Succesfully updated profile picture",
  });
});

const deleteProfilePicture = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error("user not found");
  }

  if (user._id.toString() !== req.user._id) {
    res.status(401);
    throw new Error(
      "User don't have permission to update other user profile picture"
    );
  }

  const result = await cloudinary.uploader.destroy(user.image.public_id);

  if (!result) {
    res.status(400);
    throw new Error("Failed to delete profile picture.");
  }

  await User.findByIdAndUpdate(
    req.params.id,
    {
      profile_picture: {
        public_id: "zqef8awx7nkoz4qzto19",
        url: "https://res.cloudinary.com/dzr31apfk/image/upload/v1717608010/zqef8awx7nkoz4qzto19.jpg",
      },
    },
    { new: true }
  );

  res.status(201).json({
    status: "Success",
    message: "Succesfully deleted profile picture",
  });
});

module.exports = {
  updateProfilePicture,
  uploadProfilePicture,
  deleteProfilePicture,
};
