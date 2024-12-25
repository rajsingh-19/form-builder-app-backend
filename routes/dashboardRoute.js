const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const verifiedUser = require("../middleware/auth");
const dashboardHandler = require("../controller/dashboardController");

dotenv.config();


router.get('/', verifiedUser, dashboardHandler);


module.exports = router;

