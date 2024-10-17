const asyncHandler = require("express-async-handler");
const Donation = require("../models/donationModel");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");

const { initializepayment } = require("../utils/paystack");

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

  const response = await initializepayment(form);

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

  await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { donationHistory: donation._id } },
    { new: true }
  );

  const thankYouMessage = `<p>Thank you for your donation</p>`;
  const subject = "Thankyou Message";

  sendEmail(req.user.email, subject, thankYouMessage);

  res.status(201).json(response);
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

const getAllDonations = asyncHandler(async (req, res) => {
  const donorId = req.query.id;
  const donation = await Donation.find({ donor_id: donorId }).populate(
    "campaign_id"
  );

  res.status(200).json(donation);
});

module.exports = { createDonation, getDonation, getAllDonations };
