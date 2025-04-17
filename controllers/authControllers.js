const User = require("../models/user");
const ErrorHandler = require("../utilis/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utilis/jwtToken");
const sendTokenGuest = require("../utilis/guestjwtgenerate");
const sendEmail = require("../utilis/sendResetEmail");
const crypto = require("crypto");
const APIFeatures = require("../utilis/APIFeatures");
const cloudinary = require("../utilis/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { checkVerification, sendVerification } = require("../middleware/twilio");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const twilio = require("twilio");
// const User = require("../models/User"); // Replace with your actual User model path

// const accountSid = process.env.TWILIO_ACCOUNT_SID; // Add to your .env
// const authToken = process.env.TWILIO_AUTH_TOKEN;   // Add to your .env
// const serviceSid = process.env.TWILIO_SERVICE_SID; // Add to your .env

const accountSid = 'AC9bfc030357ae904c56ddf42eabbe25bd'
const authToken = '7ceb02f9bdbe8327681aa808e80e387a'
// const serviceSid = 'VA6abfb22b04cdc49c3762bfd828d6984f'
const serviceSid = 'VA67db8e19e1028bba139d221498254d22'

const userClient = twilio(accountSid, authToken);
// Login User  =>  /api/v1/login

require('dotenv').config()



//Get currently logged in user data  /api/v1/currentUser

exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  try {
    const user = await User.findById(req?.user?.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Update User Profile /api/v1/user_profile/edit_profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  console.log("Update Prodile", req.body)
  try {
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      phoneNo: req.body.phoneNo,
      lastName: req.body.lastName,
    };

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: newUserData },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
});


// Logout User  =>  /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      user: {
        message: "Logged Out Successfully",
      },
    });
  } catch (error) {
    next(error);
  }
});

//Get All user ===> /api/v1/admin/all_user
exports.allUsers = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = parseInt(req.query.limit) || 10;
  const apiFeatures = new APIFeatures(User.find(), req.query)
    .search()
    .filter()
    .sort()
    .pagination(resPerPage);
  const users = await apiFeatures.query;

  const usersCount = await new APIFeatures(User.find(), req.query)
    .search()
    .filter()
    .sort()
    .query.countDocuments({});

  res.status(200).json({
    success: true,
    count: users.length,
    usersCount,
    users,
  });
});

//Update User ===> /api/v1/admin/user/:id
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
  const password = await bcrypt.hash(req.body.password, 10);

  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    phoneNo: req.body.phoneNo,
    password: password,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(
      ErrorHandler(`User does not found with this id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
  });
});

//Delete User ===> /api/v1/admin/user/:id
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(
      ErrorHandler(`User does not found with this id: ${req.params.id}`)
    );
  }

  //Remove Profile Pic from Cloudinary - TODO
  await user.remove();

  res.status(200).json({
    success: true,
  });
});

//Update User ===> /api/v1/user
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  // let { url } = await cloudinary(req.body.Profilepic);
  const newUserData = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return res.status(500).json({
      success: false,
      error: {
        message: `User does not found with this id: ${req.user.id}`,
      },
    });
  }

  res.status(200).json({
    success: true,
    message: "profile updated successfully",
    user,
  });
});

exports.updateUserProfilePic = catchAsyncErrors(async (req, res, next) => {
  let { url } = await cloudinary(req.file);
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profilePic: url },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  if (!user) {
    return res.status(500).json({
      success: false,
      error: {
        message: `User does not found with this id: ${req.user.id}`,
      },
    });
  }

  res.status(200).json({
    success: true,
    message: "profile pic updated successfully",
    user,
  });
});

exports.sendOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number is required." });
  }

  try {
    // Send OTP using Twilio Verify Service v2
    const verification = await userClient.verify
      .v2
      .services(serviceSid) // Use v2 here
      .verifications
      .create({ to: `${phone}`, channel: "sms" });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully.",
      sid: verification.sid, // Optional: for debugging purposes
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again later.",
    });
  }
};

exports.verifyOtp = catchAsyncErrors(async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({
      success: false,
      message: "Phone number and OTP code are required.",
    });
  }

  try {
    // Verify OTP using Twilio Verify Service v2
    const verificationCheck = await userClient.verify
      .v2
      .services(serviceSid)
      .verificationChecks
      .create({ to: `${phone}`, code });

    if (verificationCheck.status === "approved") {
      // Check if the user exists based on phoneNo
      let user = await User.findOne({ phoneNo: phone });

      if (!user) {
        // Create new user if they don't exist
        user = await User.create({
          phoneNo: phone,
          name: `User ${phone}`, // You can adjust the name field or request it from the user
          isVerifiedPhone: true,
          isVerified: true, // Assuming phone verification implies user account verification
        });
      } else {
        // If user exists, update phone verification status
        user.isVerifiedPhone = true;
        await user.save();
      }

      // Send a login token (JWT) for the user
      sendToken(user, 200, res);
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again later.",
    });
  }
});


exports.loginWithOtp = catchAsyncErrors(async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({
      success: false,
      message: "Phone number and OTP code are required.",
    });
  }

  try {
    // Verify OTP using Twilio Verify Service v2
    const verificationCheck = await userClient.verify
      .v2
      .services(serviceSid)
      .verificationChecks
      .create({ to: `${phone}`, code });

    if (verificationCheck.status === "approved") {
      // Check if the user exists based on phoneNo
      let user = await User.findOne({ phoneNo: phone });

      if (!user) {
        // Create new user if they don't exist
        return res.status(404).json({
          success: false,
          message: "User Not fount Please Register.",
        });
      } else {
        // If user exists, update phone verification status
        // Send a login token (JWT) for the user
        sendToken(user, 200, res);
      }
      
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify OTP. Please try again later.",
    });
  }
});

exports.verifyEmail = catchAsyncErrors(async (req, res) => {
  const { name, email } = req.body;
  const user = await User.findOne({
    email: email,
  });

  sendEmail({
    email: email,
    subject: "Email verification link",
    message: `Hello ${name},\n\nPlease verify your account by clicking the link:
      http://api.tanziva.com/api/v1/confirmation/${user.getJwtToken()}\n\nThank You!\n`,
  });

  res.status(200).json({
    success: true,
    user,
  });
});
