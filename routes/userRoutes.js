const express = require("express");
const {
  loginUser,
  registerUser,
  currentUser,
  emailVerification,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateToken");
const upload = require("../middleware/multer");
const {
  uploadProfilePicture,
  updateProfilePicture,
  deleteProfilePicture,
} = require("../controllers/profileController");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/current", validateToken, currentUser);

router.get("/verify/:token", emailVerification);

router
  .route("/:id/profile-picture")
  .post(validateToken, upload.single("image"), uploadProfilePicture)
  .put(validateToken, upload.single("image"), updateProfilePicture)
  .delete(validateToken, upload.single("image"), deleteProfilePicture);

module.exports = router;
