const asyncHandler = require("express-async-handler");
const Organization = require("../models/organizationModel");
const cloudinary = require("../utils/cloudinary");

const uploadPdf = asyncHandler(async (req, res) => {
  const pdf = await cloudinary.uploader.upload(req.file.path);
  if (!pdf) {
    res.status(400);
    throw new Error("Failed to upload pdf.");
  }

  await Organization.findByIdAndUpdate(
    req.params.id,
    { casCertificate: { public_id: pdf.public_id, url: pdf.secure_url } },
    { new: true }
  );

  res.status(201).json({ message: "success" });
});

module.exports = { uploadPdf };
