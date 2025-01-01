const Dashboard = require('../models/dashboard.schema');
const FolderModel = require('../models/folder.schema');
const FormModel = require('../models/form.schema');

//              Create a new folder inside a dashboard
const createFolder = async (req, res) => {
    const { folderName } = req.body;          // Extract folder name and user Id from request body
    const { dashboardId } = req.params; // Extract dashboardId from the URL
    
    if (!dashboardId) {
        return res.status(400).json({ message: "Dashboard ID is required" });
    };

    // Check if the formId is provided
    if(!folderName) {
        return res.status(404).json({ message: 'Folder name not found' });
    };

    //          Try Catch block for error handling 
    try {
        // Find the dashboard by ID
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Ensure folder name is unique 
        const isFolderNameUnique = dashboard.folders.some(folder => folder.name === folderName);
        if (isFolderNameUnique) {
            return res.status(400).json({ message: 'Folder name must be unique' });
        }

        // Create the form object directly as part of the dashboard
        // const newFolder = { name: folderName, folderId: new mongoose.Types.ObjectId() };

        // Add the new form to the dashboard's forms array
        // dashboard.folders.push(newFolder);

        // Create the folder object
        const folder = new FolderModel({ name: folderName, dashboardId });
        await folder.save(); // Save the folder in the database

        // Link the folder to the dashboard
        dashboard.folders.push({ folderId: folder._id, name: folderName });
        await dashboard.save(); // Save the updated dashboard

        // Return the updated dashboard or the new folder as a response
        res.status(201).json({ message: 'Form created successfully', folder, dashboardId });
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
    //          Try Catch block for error handling 
    try {
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        res.status(201).json(dashboard.folders); // Return the folders inside the dashboard
    } catch (error) {
        res.status(500).json({ message: 'Error fetching folders', error });
    }
};

//              Delete a folder by ID
const deleteFolder = async (req, res) => {
    const { dashboardId, folderId } = req.params;       // Extract dashboardId and folderId from the URL

    //          Try Catch block for error handling 
    try {
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Check if the folderId is provided
        if(!folderId) {
            return res.status(404).json({ message: 'FolderId not found' });
        }

        // Convert the folderId to an ObjectId for comparison
        const folderObjectId = mongoose.Types.ObjectId(folderId);

        // Find the folder and remove it from the dashboard
        const folderIndex = dashboard.folders.findIndex(folder => folder._id.toString() === folderObjectId.toString());
        if (folderIndex === -1) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        // Get the folder object to delete it from the folder collection
        const folderToDelete = dashboard.folders[folderIndex];

        // Remove the folder
        dashboard.folders.splice(folderIndex, 1);
        await dashboard.save();

        // Delete the folder from the Folder collection
        await FolderModel.findByIdAndDelete(folderToDelete._id);

        res.status(201).json({ message: 'Folder deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting folder', error });
    }
};

module.exports = { createFolder, addFormToFolder, getFolders, deleteFolder };



