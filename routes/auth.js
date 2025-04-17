const express = require("express");
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const {

  currentUser,
  updateProfile,
  logout,
  allUsers,
  updateUser,
  deleteUser,
  updateUserProfile,
  updateUserProfilePic,
  sendOtp,
  verifyOtp,
  loginWithOtp,
  // VerifyUser,
} = require("../controllers/authControllers");
const multer = require("multer");
const upload = multer();

router.route("/currentUser").get(isAuthenticatedUser, currentUser);

router.route("/profile/edit_profile").put(isAuthenticatedUser, updateProfile);

router.route("/logout").get(logout);

router
  .route("/admin/all_users")
  .get(isAuthenticatedUser, authorizeRoles("admin"), allUsers);

router
  .route("/admin/users/:id")
  // .get(isAuthenticatedUser, authorizeRoles("admin"), getUserDetails)
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateUser)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

router.route("/user").post(isAuthenticatedUser, updateUserProfile);
router
  .route("/userProfilePic")
  .post(isAuthenticatedUser, upload.single("Profilepic"), updateUserProfilePic);

  
  router.post("/send-otp", sendOtp);
  router.post("/verify-otp", verifyOtp);
  router.post("/login-with-otp", loginWithOtp);

  // router.route("/confirmation/:token").get(VerifyUser);

module.exports = router;
