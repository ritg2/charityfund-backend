const express = require("express");
const {
  createOrganization,
  getOrganization,
  approveOrganization,
  getPendingOrganizations,
} = require("../controllers/organizationController");
const validateToken = require("../middleware/validateToken");
const { uploadImage } = require("../controllers/logoController");
const upload = require("../middleware/multer");
const { uploadPdf } = require("../controllers/pdfController");

const router = express.Router();

router.get("/", getPendingOrganizations);
router.get("/:userid", getOrganization);

router.post("/logo/:id", validateToken, upload.single("image"), uploadImage);
router.post("/pdf/:id", validateToken, upload.single("pdf"), uploadPdf);

router.post("/create", validateToken, createOrganization);
router.post("/approve/:id", validateToken, approveOrganization);

module.exports = router;
