const mongoose = require("mongoose");

const senderAddressSchema = new mongoose.Schema({
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CompaniesDetail",  // Assuming you have a Company model
      required: [true, "Please enter the company ID"],
    },
    companyName: {
      type: String,
      required: [true, "Please enter the company name"],
    },
    senderAddress: {
      type: String,
      required: [true, "Please enter the sender address"],
    }
  }, {timestamps: true});

const SenderAddress = mongoose.model('SenderAddress', senderAddressSchema);

module.exports = SenderAddress;
