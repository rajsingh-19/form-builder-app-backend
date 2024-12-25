const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const verifiedUser = require("../middleware/auth");
// Importing controllers
const { registerHandler, loginHandler, updateUserHandler } = require("../controller/userController");

// Configuring dotenv to load environment variables
dotenv.config();        // Load .env file variables into process.env

// Defining routes
router.post('/register', registerHandler);      // POST route for user registration, handled by registerHandler
router.post('/login', loginHandler);            // POST route for user login, handled by loginHandler
router.put('/settings', verifiedUser, updateUserHandler);        //PUT route for updating the user

// Exporting the router to use in other parts of the application
module.exports = router;
