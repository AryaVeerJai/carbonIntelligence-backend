const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


//verifiedByAdmin 0->pending 1->approved 2->declined


const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "Please Enter Name"],
    maxlength: [30, "Your name cannot be exceed more than 30 Character"],
  },
  email: {
    type: String,
    // required: [true, "Please Enter Email"],
    // unique: [true, "User already exist"],
    validate: [validator.isEmail, "Please Enter Valid Email"],
  },
  profilePic: {
    type: String,
    default: ""
  },
  phoneNo: {
    type: String,
    required: [false, "Please Enter Phone Number"],
    unique: [true, "User whith this phone number already exist!"],
  },
  aadhar: {
    type: String,
    unique: [true, "User with this Aadhar already exist!"],
  },
  location: {
    type: String,
  },
  education: {
    type: String,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isVerifiedPhone: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

//Encrypting Password before saving the user

userSchema.pre("save", async function (next) {
  //Checking if password is modified or not
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

//Compare User Password

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Return JWT Token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME
  })
};

//Generate Reset Password token

userSchema.methods.getResetPasswordToken = function () {
  //Generate Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Encrypt the token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //Set the token expire
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model("User", userSchema);
