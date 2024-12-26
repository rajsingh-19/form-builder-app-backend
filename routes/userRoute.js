const express = require('express');
const updateUser = require("../controller/userController");        // Import the controller
const authMiddleware = require('../middleware/authMiddleware');        // Middleware for authentication

const router = express.Router();

// Route for updating user settings (name, email or password)
router.put('/update', authMiddleware, updateUser);

module.exports = router;
