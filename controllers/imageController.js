const asyncHandler = require("express-async-handler");
const Campaign = require("../models/campaignModel");
const cloudinary = require("../utils/cloudinary");
const Organization = require("../models/organizationModel");

const uploadImage = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error("campaign not found");
  }

  const organization = await Organization.findOne({ userId: req.user._id });
  if (!organization) {
    res.status(404);
    throw new Error("Organization not found");
  }

  if (campaign.organization_id.toString() !== organization._id.toString()) {
    res.status(401);
    throw new Error("User don't have permission to update other user Campaign");
  }

  const result = await cloudinary.uploader.upload(req.file.path);
  if (!result) {
    res.status(400);
    throw new Error("Failed to upload image.");
  }

  await Campaign.findByIdAndUpdate(
    req.params.id,
    { image: { public_id: result.public_id, url: result.secure_url } },
    { new: true }
  );

  res
    .status(201)
    .json({ status: "Success", message: "Succesfully uploaded image" });
});

const updateImage = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error("campaign not found");
  }

  if (campaign.user_id.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User don't have permission to update other user Campaign");
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    public_id: campaign.public_id,
    overwrite: true,
  });

  if (!result) {
    res.status(400);
    throw new Error("Failed to update image.");
  }

  await Campaign.findByIdAndUpdate(
    req.params.id,
    { image: { public_id: result.public_id, url: result.secure_url } },
    { new: true }
  );

  res
    .status(201)
    .json({ status: "Success", message: "Succesfully updated image" });
});

const deleteImage = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error("campaign not found");
  }

  if (campaign.user_id.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User don't have permission to update other user Campaign");
  }

  const result = await cloudinary.uploader.destroy(campaign.image.public_id);

  if (!result) {
    res.status(400);
    throw new Error("Failed to delete image.");
  }

  await Campaign.findByIdAndUpdate(
    req.params.id,
    {
      image: {
        public_id: "zqef8awx7nkoz4qzto19",
        url: "https://res.cloudinary.com/dzr31apfk/image/upload/v1717608010/zqef8awx7nkoz4qzto19.jpg",
      },
    },
    { new: true }
  );

  res
    .status(201)
    .json({ status: "Success", message: "Succesfully deleted image" });
});

module.exports = { updateImage, uploadImage, deleteImage };
