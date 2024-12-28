const express = require('express');
const jwt = require('jsonwebtoken');
const Dashboard = require('../models/dashboard.schema');
const UserModel = require('../models/user.schema');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Generate invite link
router.post('/share/invite-link', authMiddleware, async (req, res) => {
    const { accessMode } = req.body; // 'edit' or 'readonly'
    const userId = req.user.id; // User who owns the dashboard

    try {
        const inviteToken = jwt.sign(
            { userId, accessMode }, // Include accessMode in the payload
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Link valid for 7 days
        );

        const inviteLink = `${process.env.FRONTEND_URL}/dashboard/invite/${inviteToken}`;
        res.status(200).json({ inviteLink });
    } catch (error) {
        res.status(500).json({ message: 'Error generating invite link', error });
    }
});

// Validate invite link
router.get('/invite/:token', async (req, res) => {
    const { token } = req.params;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, accessMode } = decoded;

        // Fetch the dashboard and validate ownership
        const dashboard = await Dashboard.findOne({ owner: userId });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Find the shared user's name
        const sharedUser = await UserModel.findById(userId);
        if (!sharedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the dashboard with the accessMode and the shared person's name
        res.status(200).json({
            message: 'Dashboard accessed successfully',
            dashboard,
            accessMode,
            sharedUserName: sharedUser.userName // Add the shared user's name here
        });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token', error });
    }
});

// Add collaborator
router.post('/add-collaborator', authMiddleware, async (req, res) => {
    const { email, accessMode } = req.body;
    const ownerId = req.user.id;

    try {
        const dashboard = await Dashboard.findOne({ owner: ownerId });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Find collaborator by email
        const collaborator = await UserModel.findOne({ email });
        if (!collaborator) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add collaborator to the dashboard
        dashboard.collaborators.push({
            userId: collaborator._id,
            accessMode,
        });

        await dashboard.save();
        res.status(200).json({ message: 'Collaborator added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding collaborator', error });
    }
});

module.exports = router;




