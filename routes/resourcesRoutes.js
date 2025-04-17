const express = require("express");
const { addResourceUsage } = require("../controllers/resourcesController");
const router = express.Router();

router.post("/resources/add", addResourceUsage);

module.exports = router;
