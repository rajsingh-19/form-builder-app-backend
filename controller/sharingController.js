const Dashboard = require('../models/dashboard.schema');
const UserModel = require('../models/user.schema');

// Share a dashboard
const shareDashboard = async (req, res) => {
    const { dashboardId, email, accessMode } = req.body;
    const userId = req.user.id;

    try {
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        if (dashboard.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Add collaborator
        dashboard.collaborators.push({ userId: user._id, accessMode });
        await dashboard.save();

        res.status(200).json({ message: 'Dashboard shared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sharing dashboard', error });
    }
};

module.exports = shareDashboard;
