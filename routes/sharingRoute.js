const express = require('express');
const shareDashboard = require('../controller/sharingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for sharing a dashboard
router.post('/share', authMiddleware, shareDashboard);

module.exports = router;
