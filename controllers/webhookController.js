const asyncHandler = require("express-async-handler");
const crypto = require("crypto");
const { verifypayment } = require("../utils/paystack");
const Campaign = require("../models/campaignModel");
const Donation = require("../models/donationModel");

const verifyDonation = asyncHandler(async (req, res) => {
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    res.status(400);
    throw new Error("Invalid signature");
  }

  res.status(200);

  const event = JSON.parse(req.body);
  console.log(event);

  if (event.event === "charge.success") {
    const reference = event.data.reference;

    const response = await verifypayment(reference);
    const { status, amount } = response.data;

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
      donation.campaign_id,
      { $inc: { currentAmount: amount / 100 } },
      { new: true }
    );

    if (!campaign) {
      res.status(404);
      throw new Error("Campaign not found!");
    }
  } else {
    res.status(400);
    throw new Error("Event not handled");
  }
});

module.exports = { verifyDonation };
