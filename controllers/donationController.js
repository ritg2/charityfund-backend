const asyncHandler = require("express-async-handler");

const createDonation = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount) {
    res.status(400);
    throw new Error("Amount is required");
  }

  const donation = await Donation.create({
    amount,
    donor_id: req.user._id,
    campaign_id: "",
  });

  res.status(201).json(donation);
});

module.exports = createDonation