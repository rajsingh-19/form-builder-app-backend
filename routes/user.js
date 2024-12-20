const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
// Importing controllers
const registerHandler = require("../controller/registerController");
const loginHandler = require("../controller/loginController");
// Configuring dotenv to load environment variables
dotenv.config();        // Load .env file variables into process.env
// Defining routes
router.post('/register', registerHandler);      // POST route for user registration, handled by registerHandler
router.post('/login', loginHandler);            // POST route for user login, handled by loginHandler


// Exporting the router to use in other parts of the application
module.exports = router;
