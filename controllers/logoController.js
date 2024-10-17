const asyncHandler = require("express-async-handler");
const Organization = require("../models/organizationModel");
const cloudinary = require("../utils/cloudinary");

const uploadImage = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  if (!organization) {
    res.status(404);
    throw new Error("Organization not found");
  }

  console.log(organization.userId);

  if (organization.userId.toString() !== req.user._id) {
    res.status(401);
    throw new Error(
      "User don't have permission to update other user Organization"
    );
  }

  console.log(req.file.path);

  const result = await cloudinary.uploader.upload(req.file.path);
  if (!result) {
    res.status(400);
    throw new Error("Failed to upload image.");
  }

  await Organization.findByIdAndUpdate(
    req.params.id,
    { logoUrl: { public_id: result.public_id, url: result.secure_url } },
    { new: true }
  );

  res
    .status(201)
    .json({ status: "Success", message: "Succesfully uploaded image" });
});

module.exports = { uploadImage };
