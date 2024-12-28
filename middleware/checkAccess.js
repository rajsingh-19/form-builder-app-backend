const Dashboard = require('../models/dashboard.schema');
const UserModel = require('../models/user.schema');

const checkAccess = (requiredMode) => {
    return async (req, res, next) => {
        const userId = req.user.id;
        const { dashboardId } = req.params;

        try {
            const dashboard = await Dashboard.findById(dashboardId);
            if (!dashboard) {
                return res.status(404).json({ message: 'Dashboard not found' });
            }

            // Check if user is the owner
            if (dashboard.owner.toString() === userId) {
                return next(); // Owners have full access
            }

            // Check collaborator permissions
            const collaborator = dashboard.collaborators.find(
                (collab) => collab.userId.toString() === userId
            );

            if (!collaborator || (requiredMode === 'edit' && collaborator.accessMode !== 'edit')) {
                return res.status(403).json({ message: 'Access denied' });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Error checking access permissions', error });
        }
    };
};

module.exports = checkAccess;
