const express = require('express');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');
const dashboardController = require('../controller/dashboardController');

const router = express.Router();

// Create a new dashboard
router.post('/create', authMiddleware, dashboardController.createDashboard);

// Fetch Dashboard by userId (for the frontend to show the user's name in the navbar)
router.get('/:userId', authMiddleware, dashboardController.getDashboardByUserId);

// Share Dashboard (Generate Invite Link)
router.post('/share/invite-link', authMiddleware, dashboardController.shareDashboard);

// Validate invite link
router.get('/invite/:token', dashboardController.validateInviteLink);

// Add collaborator
router.post('/add-collaborator', authMiddleware, dashboardController.addCollaborator);

module.exports = router;
