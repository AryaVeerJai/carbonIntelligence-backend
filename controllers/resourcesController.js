const ResourcesUsage = require("../models/resourcesUsage");
const CompaniesDetail = require("../models//companyDetails");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utilis/errorHandler");

// Add Resource Usage => /api/v1/resources/add
exports.addResourceUsage = catchAsyncErrors(async (req, res, next) => {
    const { userName, senderAddress, message } = req.body;

    // Find the company details based on senderAddress (companyId)
    const company = await CompaniesDetail.findOne({ companyId: senderAddress });

    if (!company) {
        return next(new ErrorHandler("Company not found", 404));
    }

    // Extract the category and weightage
    const { category, weightage } = company;

    // // Extract transaction amount from the message
    // const amountMatch = message.match(/₹(\d+)/);
     // Extract transaction amount from the message (handles ₹XXX and Rs. XXX formats)
     const amountMatch = message.match(/(?:₹|Rs\.?)\s?(\d+(\.\d+)?)/);
    const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;

    if (!amount) {
        return next(new ErrorHandler("Transaction amount not found in message", 400));
    }

    // Determine the relevant field based on the category
    let updateField = {};
    switch (category) {
        case "Shopping & E-commerce":
            updateField.shopping = amount * (weightage / 10);
            break;
        case "Outlets (Petrol Pumps, Shops, etc.)":
            updateField.fuel = amount * (weightage / 10);
            break;
        case "Fuel":
            updateField.fuel = amount * (weightage / 10);
            break;
        case "Business (Delivery & Online Services)":
            updateField.transport = amount * (weightage / 10);
            break;
        case "Banking & Financial Services":
            updateField.caseWDL = senderAddress; // Store sender ID for tracking withdrawals
            break;
        case "Water Services":
            updateField.water = amount * (weightage / 10);
            break;
        case "Electricity":
            updateField.electricity = amount * (weightage / 10);
            break;
        case "CashWDL":
            updateField.caseWDL = amount * (weightage / 10);
            break;
        case "Waste Management":
            updateField.waste = amount * (weightage / 10);
            break;
        default:
            return next(new ErrorHandler("Category not recognized", 400));
    }

    // Find or create the resource usage record for the user in the current month
    const currentMonth = new Date().toISOString().slice(0, 7); // Format YYYY-MM
    let resourceUsage = await ResourcesUsage.findOne({ userName, month: currentMonth });

    if (resourceUsage) {
        // Update the existing resource usage record
        Object.keys(updateField).forEach(field => {
            resourceUsage[field] = (resourceUsage[field] || 0) + updateField[field];
        });
        await resourceUsage.save();
    } else {
        // Create a new resource usage record
        resourceUsage = await ResourcesUsage.create({
            userName,
            month: currentMonth,
            ...updateField
        });
    }

    res.status(200).json({
        success: true,
        message: "Resource usage updated successfully",
        resourceUsage
    });
});
