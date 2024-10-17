const Organization = require("../models/organizationModel");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");

const createOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.findOne({ userId: req.user._id });
  if (organization) {
    res.status(400);
    throw new Error("organization already exist");
  }

  const { organizationName, missionStatement, logoUrl } = req.body;

  const createdOrganization = await Organization.create({
    userId: req.user._id,
    organizationName,
    missionStatement,
    logoUrl,
  });

  const subject = "NGO creation";
  const email = req.user.email;
  const html = `<p>Thankyou for starting an NGO with us, your is awaiting approval</p>`;

  sendEmail(email, subject, html);

  res.status(201).json(createdOrganization);
});

const getOrganization = asyncHandler(async (req, res) => {
  const userid = req.params.userid;
  const organization = await Organization.findOne({ userId: userid });
  if (!organization) {
    res.status(404);
    throw new Error("Organization not found");
  }

  res.status(200).json(organization);
});

const getPendingOrganizations = asyncHandler(async (req, res) => {
  const organization = await Organization.find({ status: "pending" });
  res.status(200).json(organization);
});

const updateOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  if (!organization) {
    res.status(404);
    throw new Error("organization not found");
  }
  if (organization.userId.toString() !== req.user._id) {
    res.status(401);
    throw new Error("User don't have permission to update other user Campaign");
  }

  const updatedOrganization = await Organization.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(201).json(updatedOrganization);
});

const deleteOrganization = asyncHandler(async (req, res) => {
  const organization = await Organization.findById(req.params.id);
  if (!organization) {
    res.status(404);
    throw new Error("organization not found");
  }

  if (organization.user_id.toString() !== req.user._id) {
    res.status(401);
    throw new Error(
      "User don't have permission to update other user organization"
    );
  }

  res.status(201).json(organization);
});

const approveOrganization = asyncHandler(async (req, res) => {
  if (req.user.role !== "admin") {
    res.status(401);
    throw new Error("You are not authorized to approve campaign!");
  }

  const organization = await Organization.findById(req.params.id).populate(
    "userId"
  );
  if (!organization) {
    res.status(404);
    throw new Error("Organization doesn't exist!");
  }

  const updatedOrganization = await Organization.findByIdAndUpdate(
    req.params.id,
    { status: "approved" },
    { new: true }
  );

  const subject = "NGO approval";
  const email = organization.userId.email;
  const html = `<p>Thankyou for starting an NGO with us, your is NGO has been approved you can start creating campaigns</p>`;

  sendEmail(email, subject, html);

  res.status(201).json(updatedOrganization);
});

module.exports = {
  createOrganization,
  getOrganization,
  getPendingOrganizations,
  updateOrganization,
  deleteOrganization,
  approveOrganization,
};
