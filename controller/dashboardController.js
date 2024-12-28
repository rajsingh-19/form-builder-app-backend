const Dashboard = require('../models/dashboard.schema');
const User = require('../models/user.schema');

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

// Share Dashboard (Invite Link and Email)
const shareDashboard = async (req, res) => {
    const { accessMode } = req.body; // 'edit' or 'readonly'
    const userId = req.user.id; // User who owns the dashboard

    try {
        const inviteToken = jwt.sign(
            { userId, accessMode },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        const inviteLink = `${process.env.FRONTEND_URL}/dashboard/invite/${inviteToken}`;
        res.status(200).json({ inviteLink });
    } catch (error) {
        res.status(500).json({ message: 'Error generating invite link', error });
    }
};

module.exports = { createDashboard, shareDashboard };
