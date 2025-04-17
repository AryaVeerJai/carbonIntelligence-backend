const mongoose = require("mongoose");

const resourcesUsageSchema = new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // Assuming you have a User model
      // required: [true, "Please enter the user ID"],
    },
    userName: {
      type: String,
      // required: [true, "Please enter the user name"],
    },
    month: {
      type: String,
    },
    fuel: {
      type: Number,
    },
    shopping: {
      type: Number,
    },
    transport: {
      type: Number,
    },
    water: {
      type: Number,
    },
    electricity: {
      type: Number,
    },
    waste: {
      type: Number,
    },
    caseWDL: {
      type: String,  // Can be a string for case identifier or any specific code
    }
  }, {timestamps: true});

const ResourcesUsage = mongoose.model('ResourcesUsage', resourcesUsageSchema);

module.exports = ResourcesUsage;
