const asyncHandler = require("express-async-handler");
const Campaign = require("../models/campaignModel");
const cloudinary = require("../utils/cloudinary");
const Organization = require("../models/organizationModel");
const User = require("../models/userModel");

//private
const createCampaign = asyncHandler(async (req, res) => {
  const { title, description, goalAmount, endDate, startDate, tags } = req.body;
  if (req.user.role !== "ngo") {
    res.status(400);
    throw new Error("user is not an NGO");
  }
  if (!title || !description || !goalAmount || !endDate) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const organizationId = await Organization.findOne({
    userId: req.user._id,
  }).select("_id");

  if (!organizationId) {
    res.status(404);
    throw new Error("NGO does not exist");
  }

  const campaign = await Campaign.create({
    organization_id: organizationId,
    title,
    description,
    goalAmount,
    endDate,
    startDate,
    tags,
  });

  await Organization.findByIdAndUpdate(
    organizationId,
    { $addToSet: { campaigns: campaign._id } },
    { new: true }
  );

  res.status(201).json(campaign);
});

//public
const getAllCampaigns = asyncHandler(async (req, res) => {
  const { user, search, tags, page = 1, limit = 10 } = req.query;

  const queryObject = {};

  if (search) {
    queryObject.title = { $regex: search, $options: "i" };
  }

  if (tags) {
    const tagsArray = tags.split(",");
    queryObject.tags = { $in: tagsArray };
  }

  if (user) {
    queryObject.user_id = user;
  }

  const skip = (Number(page) - 1) * Number(limit);

  let result = Campaign.find(queryObject).skip(skip).limit(Number(limit));

  const campaign = await result;
  const totalCampaigns = await Campaign.countDocuments(queryObject);
  const numOfpages = Math.ceil(totalCampaigns / Number(limit));

  res.status(200).json({
    campaign,
    totalCampaigns,
    numOfpages,
    currentPage: Number(page),
  });
});

//public
const getCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error("campaign not found");
  }

  res.status(201).json(campaign);
});

//private
const updateCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error("campaign not found");
  }

  const organizationId = await Organization.findOne({
    userId: req.user.id,
  }).select("_id");

  if (campaign.organization_id.toString() !== organizationId.toString()) {
    res.status(401);
    throw new Error(
      "User don't have permission to update other organization Campaign"
    );
  }

  const updatedCampaign = await Campaign.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(201).json(updatedCampaign);
});

//private
const deleteCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error("campaign not found");
  }

  const organizationId = await Organization.findOne({
    userId: req.user.id,
  }).select("_id");

  if (campaign.organization_id.toString() !== organizationId.toString()) {
    res.status(401);
    throw new Error(
      "User don't have permission to delete other organization Campaign"
    );
  }

  await Campaign.deleteOne({ _id: req.params.id });
  await cloudinary.uploader.destroy(campaign.image.public_id);

  res.status(201).json(campaign);
});

const saveCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error("campaign not found");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { savedCampaigns: campaign._id } },
    { new: true }
  );

  res.status(201).json(campaign);
});

const unsaveCampaign = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error("campaign not found");
  }

  await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { savedCampaigns: campaign._id } },
    { new: true }
  );

  res.status(201).json(campaign);
});

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  saveCampaign,
  unsaveCampaign,
};
