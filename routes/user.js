const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

const registerHandler = require("../controller/registerController");
const loginHandler = require("../controller/loginController");

dotenv.config();

router.post('/register', registerHandler);

router.post('/login', loginHandler);

module.exports = router;
