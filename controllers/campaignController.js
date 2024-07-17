const asyncHandler = require("express-async-handler");
const Campaign = require("../models/campaignModel");
const cloudinary = require("../utils/cloudinary");

//private
const createCampaign = asyncHandler(async (req, res) => {
  const { title, description, goalAmount, endDate, startDate, tags } = req.body;
  if (!title || !description || !goalAmount || !endDate) {
    res.status(400);
    throw new Error("All fields are required");
  }

  const campaign = await Campaign.create({
    user_id: req.user._id,
    title,
    description,
    goalAmount,
    endDate,
    startDate,
    tags,
  });

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

  if(user) {
    queryObject.user_id = user
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

  if (campaign.user_id.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User don't have permission to update other user Campaign");
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
    console.log(campaign.user_id.toString() !== req.user._id);
    res.status(404);
    throw new Error("campaign not found");
  }

  if (campaign.user_id.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User don't have permission to update other user Campaign");
  }

  await Campaign.deleteOne({ _id: req.params.id });
  await cloudinary.uploader.destroy(campaign.image.public_id);

  res.status(201).json(campaign);
});

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
};

