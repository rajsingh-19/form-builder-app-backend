const Dashboard = require('../models/dashboard.schema');
const User = require('../models/user.schema');
const jwt = require('jsonwebtoken');

// Create Dashboard
const createDashboard = async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;

    try {
        const dashboard = new Dashboard({ name, owner: userId });
        await dashboard.save();

        const user = await User.findById(userId);
        user.dashboards.push(dashboard._id);
        await user.save();

        res.status(201).json(dashboard);
    } catch (error) {
        res.status(500).json({ message: 'Error creating dashboard', error });
    }
};

// New method to fetch dashboard by userId
const getDashboardByUserId = async (req, res) => {
    const { userId } = req.params;  // Extract the userId from the URL parameter

    try {
        // Find the dashboard that matches the userId
        const dashboard = await Dashboard.findOne({ owner: userId });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found for this user' });
        }

        // Fetch the user details (owner of the dashboard)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return the dashboard and user info (to display the name in navbar)
        res.status(200).json({
            dashboard,
            userName: user.userName,  // Send the userName to display in the frontend
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching dashboard', error });
    }
};

// Share Dashboard (Generate Invite Link)
const shareDashboard = async (req, res) => {
    const { accessMode } = req.body; // 'edit' or 'readonly'
    const userId = req.user.id; // User who owns the dashboard

    try {
        // Generate a unique invite link with JWT
        const inviteToken = jwt.sign(
            { userId, accessMode },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // Link expires in 7 days
        );

        const inviteLink = `${process.env.FRONTEND_URL}/dashboard/invite/${inviteToken}`;
        res.status(200).json({ inviteLink });
    } catch (error) {
        res.status(500).json({ message: 'Error generating invite link', error });
    }
};

// Validate invite link and fetch dashboard details
const validateInviteLink = async (req, res) => {
    const { token } = req.params;

    try {
        // Decode the invite link's token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId, accessMode } = decoded;

        // Fetch the dashboard by owner ID
        const dashboard = await Dashboard.findOne({ owner: userId });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Fetch the user who owns the dashboard
        const owner = await User.findById(userId);
        if (!owner) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Return dashboard info along with access mode
        res.status(200).json({
            message: 'Dashboard accessed successfully',
            dashboard,
            accessMode,
            sharedUserName: owner.userName, // Return the shared user's name
        });
    } catch (error) {
        res.status(400).json({ message: 'Invalid or expired token', error });
    }
};

// Add collaborator to dashboard
const addCollaborator = async (req, res) => {
    const { email, accessMode } = req.body; // 'edit' or 'readonly'
    const ownerId = req.user.id;

    try {
        // Find the dashboard by the owner's ID
        const dashboard = await Dashboard.findOne({ owner: ownerId });
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Find the collaborator by email
        const collaborator = await User.findOne({ email });
        if (!collaborator) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add the collaborator to the dashboard
        dashboard.collaborators.push({
            userId: collaborator._id,
            accessMode,
        });
        await dashboard.save();

        res.status(200).json({ message: 'Collaborator added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding collaborator', error });
    }
};

module.exports = { createDashboard, getDashboardByUserId, shareDashboard, validateInviteLink, addCollaborator };
