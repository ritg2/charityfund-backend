const express = require("express");
const {
  loginUser,
  registerUser,
  currentUser,
  emailVerification,
  logoutUser,
  getUserData,
} = require("../controllers/userController");
const validateToken = require("../middleware/validateToken");
const upload = require("../middleware/multer");
const {
  uploadProfilePicture,
  updateProfilePicture,
  deleteProfilePicture,
} = require("../controllers/profileController");

const router = express.Router();

router.get("/current", validateToken, currentUser);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/verify/:token", emailVerification);

router.get("/profile/:id", getUserData);

router
  .route("/profile-picture/:id")
  .post(upload.single("image"), uploadProfilePicture)
  .put(validateToken, upload.single("image"), updateProfilePicture)
  .delete(validateToken, upload.single("image"), deleteProfilePicture);

module.exports = router;
