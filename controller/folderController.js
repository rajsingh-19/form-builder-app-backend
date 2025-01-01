const Dashboard = require('../models/dashboard.schema');
const FormModel = require('../models/form.schema');

//              Create a new folder inside a dashboard
const createFolder = async (req, res) => {
    const { userId, folderName } = req.body;          // Extract folder name and user Id from request body
    const { dashboardId } = req.params; // Extract dashboardId from the URL
    
    if (!dashboardId) {
        return res.status(400).json({ message: "Dashboard ID is required" });
    };

    //          Try Catch block for error handling 
    try {
        // Find the dashboard by ID
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Check if the user is the owner or has edit access
        if (dashboard.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Ensure folder name is unique within this dashboard
        if (dashboard.folders.some(folder => folder.name === folderName)) {
            return res.status(400).json({ message: 'Folder name must be unique' });
        }

        // Create folder and add it to the dashboard
        const newFolder = { name: folderName, userId, forms: [] };
        dashboard.folders.push(newFolder);
        // Save the dashboard with the new folder
        await dashboard.save();

        // Return the updated dashboard or the new folder as a response
        res.status(201).json(newFolder); // Sends the new folder back to the client
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ message: 'Error creating folder', error:"error.message" });
    }
};

// Add a form to an existing folder
const addFormToFolder = async (req, res) => {
    const { dashboardId, folderId } = req.params; // Extract dashboardId and folderId from URL
    const { formId } = req.body;
    const userId = req.user.id;

    try {
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Check if the user is the owner or has edit access
        if (dashboard.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Find the folder
        const folder = dashboard.folders.id(folderId);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        // Find the form by formId
        const form = await FormModel.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }
 
        // Add the form to the folder
        folder.forms.push(form._id);
        await dashboard.save();

        res.status(200).json(folder);
    } catch (error) {
        res.status(500).json({ message: 'Error adding form to folder', error });
    }
};

//              Get all folders for the user
const getFolders = async (req, res) => {
    const { dashboardId } = req.params; // Get the dashboard ID from the URL
    const userId = req.user.id;           // Get the user ID from the authenticated user (stored in req.user)
    //          Try Catch block for error handling 
    try {
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Check if the user has access to the dashboard
        if (dashboard.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.status(200).json(dashboard.folders); // Return the folders inside the dashboard
    } catch (error) {
        res.status(500).json({ message: 'Error fetching folders', error });
    }
};

//              Delete a folder by ID
const deleteFolder = async (req, res) => {
    const { dashboardId, folderId } = req.params;       // Extract dashboardId and folderId from the URL
    const userId = req.user.id;            
    //          Try Catch block for error handling 
    try {
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Check if the user has access to the dashboard
        if (dashboard.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Find the folder and remove it from the dashboard
        const folderIndex = dashboard.folders.findIndex(folder => folder._id.toString() === folderId);
        if (folderIndex === -1) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        // Remove the folder
        dashboard.folders.splice(folderIndex, 1);
        await dashboard.save();

            res.status(201).json({ message: 'Folder deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting folder', error });
        }
};

module.exports = { createFolder, addFormToFolder, getFolders, deleteFolder };



