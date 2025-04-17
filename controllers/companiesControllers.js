const Company = require("../models/companyDetails");
const ErrorHandler = require("../utilis/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const APIFeatures = require("../utilis/APIFeatures");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Add Company => /api/v1/companies
exports.addCompany = catchAsyncErrors(async (req, res) => {
    const { companyName, category, weightage, description } = req.body;

    const company = await Company.create({
        companyName,
        category,
        weightage,
        description
    });

    res.status(201).json({
        success: true,
        company
    });
});

// Get all Companies => /api/v1/companies
exports.getAllCompanies = catchAsyncErrors(async (req, res) => {
    const apiFeatures = new APIFeatures(Company.find(), req.query).search().filter().pagination();

    const companies = await apiFeatures.query;

    res.status(200).json({
        success: true,
        companies
    });
});

// Get a single Company => /api/v1/companies/:id
exports.getCompanyById = catchAsyncErrors(async (req, res, next) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
        return next(new ErrorHandler("Company not found", 404));
    }

    res.status(200).json({
        success: true,
        company
    });
});

// Update Company => /api/v1/companies/:id
exports.updateCompany = catchAsyncErrors(async (req, res, next) => {
    let company = await Company.findById(req.params.id);

    if (!company) {
        return next(new ErrorHandler("Company not found", 404));
    }

    company = await Company.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        company
    });
});

// Delete Company => /api/v1/companies/:id
exports.deleteCompany = catchAsyncErrors(async (req, res, next) => {
    const company = await Company.findById(req.params.id);

    if (!company) {
        return next(new ErrorHandler("Company not found", 404));
    }

    await company.deleteOne();

    res.status(200).json({
        success: true,
        message: "Company deleted successfully"
    });
});




// Bulk Update Companies => /api/v1/companies
exports.updateMultipleCompanies = catchAsyncErrors(async (req, res, next) => {
    const updates = req.body; // Expecting an array of company updates

    if (!Array.isArray(updates) || updates.length === 0) {
        return next(new ErrorHandler("Invalid input. Provide an array of company objects.", 400));
    }

    const updatePromises = updates.map(async (company) => {
        return await Company.findOneAndUpdate(
            { companyId: company.companyId.trim() }, // Lookup using `companyId`
            {
                $set: {
                    companyName: company.companyName.trim(),
                    category: company.category.trim(),
                    weightage: company.weightage,
                    description: company.description ? company.description.trim() : ""
                }
            },
            { new: true, runValidators: true, upsert: true } // Create if not found
        );
    });

    const updatedCompanies = await Promise.all(updatePromises);

    res.status(200).json({
        success: true,
        message: "Companies updated successfully",
        updatedCompanies
    });
});
