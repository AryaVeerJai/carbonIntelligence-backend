const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, "Please enter the company name"],
        unique: true,
        trim: true
    },
    companyId: {
        type: String,
        required: [true, "Please enter the company ID"],
        unique: true,
        trim: true
    },
    category: {
        type: String,
        required: [true, "Please enter the company category"],
        trim: true
    },
    weightage: {
        type: Number,
        required: [true, "Please enter the weightage"]
    },
    description: {
        type: String,
        trim: true
    }
}, {timestamps: true});

module.exports = mongoose.model("CompaniesDetail", companySchema);
