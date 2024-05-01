const asyncHandler = require("express-async-handler");
const Campaign = require("../models/campaignModel");

//private
const createCampaign = asyncHandler(async (req, res) => {
  const { title, description, goalAmount, endDate } = req.body;
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
  });
  res.status(201).json(campaign);
});

//public
const getAllCampaigns = asyncHandler(async (req, res) => {
  const campaign = await Campaign.find();
  res.status(201).json(campaign);
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
    console.log(campaign.user_id.toString() !== req.user._id)
    res.status(404);
    throw new Error("campaign not found");
  }

  if (campaign.user_id.toString() !== req.user._id) {  
    res.status(401);
    throw new Error("User don't have permission to update other user Campaign");
  }

  await Campaign.deleteOne({ _id: req.params.id });

  res.status(201).json(campaign);
});

module.exports = {
  createCampaign,
  getAllCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
};
