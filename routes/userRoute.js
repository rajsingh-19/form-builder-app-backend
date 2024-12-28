const express = require("express");
const authMiddleware = require('../middleware/authMiddleware'); // Authentication middleware
const { registerHandler, loginHandler } = require("../controller/authController");          // Importing controllers
const updateUser = require('../controller/userController'); // Update user settings controller

const router = express.Router();

// Auth routes
router.post('/register', registerHandler);      // POST route for user registration, handled by registerHandler
router.post('/login', loginHandler);            // POST route for user login, handled by loginHandler

router.post('/logout', (req, res) => {
    // Log out by clearing the token in the frontend (client-side)
    res.json({ status: true, message: "Logged out successfully" });
});

// Update User Settings
router.put('/update', authMiddleware, updateUser); // PUT route for updating user settings

// Exporting the router to use in other parts of the application
module.exports = router;
