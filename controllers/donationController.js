const asyncHandler = require("express-async-handler");
const Donation = require("../models/donationModel");
const Campaign = require("../models/campaignModel");
const { currentUser } = require("./userController");

const paystack = require("../utils/paystack")();

const createDonation = asyncHandler(async (req, res) => {
  const { amount, campaign_id } = req.body;
  if (!amount) {
    res.status(400);
    throw new Error("Amount is required");
  }

  if (!campaign_id) {
    res.status(400);
    throw new Error("Campaign_id is required");
  }

  const form = { amount, email: req.user.email, full_name: req.user.full_name };
  form.metadata = {
    full_name: form.full_name,
  };
  form.amount *= 100;

  const response = await paystack.initializepayment(form);

  if (!response) {
    res.status(400);
    throw new Error("Transaction failed!");
  }

  const donation = await Donation.create({
    amount,
    donor_id: req.user._id,
    campaign_id,
    status: "pending",
    reference: response.data.reference,
  });

  res.status(201).json(response);
});

const verifyDonation = asyncHandler(async (req, res) => {
  const { reference } = req.body;
  if (!reference) {
    res.status(400);
    throw new Error("No reference passed in body!");
  }

  const response = await paystack.verifypayment(reference);
  const { status, amount } = response.data;

  const { campaign_id } = await Donation.findOne({ reference }).select(
    "campaign_id"
  );

  const donation = await Donation.findOneAndUpdate(
    { reference, status: { $ne: "success" } },
    { status },
    { new: true }
  );

  if (!donation || status !== "success") {
    res.status(404);
    throw new Error("Payment not found or already verified!");
  }

  const campaign = await Campaign.findByIdAndUpdate(
    campaign_id,
    { $inc: { currentAmount: amount / 100 } },
    { new: true }
  );

  if (!campaign) {
    res.status(404);
    throw new Error("Campaign not found!");
  }

  res.status(200).json({ status: "Success", data: donation });
});

const getDonation = asyncHandler(async (req, res) => {
  const { reference } = req.body;
  if (!reference) {
    res.status(400);
    throw new Error("No reference passed in body!");
  }
  const transaction = await Donation.findOne({ reference });

  if (!transaction) {
    res.status(404);
    throw new Error("Payment not found!");
  }
  res.status(201).json(transaction);
});

module.exports = { createDonation, verifyDonation, getDonation };
