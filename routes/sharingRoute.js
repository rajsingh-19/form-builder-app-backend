const express = require('express');
const shareDashboard = require('../controllers/sharingController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for sharing a dashboard
router.post('/share', authMiddleware, shareDashboard);

module.exports = router;
