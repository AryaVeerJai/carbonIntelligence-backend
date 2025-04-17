const express = require("express");
const router = express.Router();
const {
    addCompany,
    getAllCompanies,
    getCompanyById,
    updateCompany,
    deleteCompany,
    updateMultipleCompanies
} = require("../controllers/companiesControllers");

const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

// Public Routes
router.route("/companies").get(getAllCompanies);
router.route("/companies/:id").get(getCompanyById);

// Admin-Only Routes
// router.route("/companies").post(isAuthenticatedUser, authorizeRoles("admin"), addCompany);
router.route("/companies").post(addCompany);
// router.route("/companies/:id")
router.route("/companies/:id")
    // .put(isAuthenticatedUser, authorizeRoles("admin"), updateCompany)
    .put(updateCompany)
    // .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteCompany);
    .delete(deleteCompany);

router.route("/companies").put(updateMultipleCompanies);


module.exports = router;
