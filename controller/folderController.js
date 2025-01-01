const Dashboard = require('../models/dashboard.schema');

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

        // Create a new folder object and add it directly into the dashboard's folders array
        const newFolder = { name: folderName, forms: [] };
        // await folder.save(); // Save the folder in the database

        // Link the folder to the dashboard
        dashboard.folders.push(newFolder);
        await dashboard.save(); // Save the updated dashboard

        // Return the updated dashboard or the new folder as a response
        res.status(201).json({ message: 'Form created successfully', newFolder, dashboardId });
    } catch (error) {
        console.error('Error creating folder:', error);
        res.status(500).json({ message: 'Error creating folder', error: error.message });
    }
};

// Add a form to an existing folder
const addFormToFolder = async (req, res) => {
    const { dashboardId, folderId } = req.params; // Extract dashboardId and folderId from URL
    const { formName } = req.body;

    // Validate required parameters
    if (!formName) {
        return res.status(400).json({ message: 'Form name is required' });
    };

    if (!dashboardId || !folderId) {
        return res.status(400).json({ message: 'Dashboard ID and Folder ID are required' });
    };

    try {
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        };

        // Find the folder
        const folder = dashboard.folders.id(folderId);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        };

        // Ensure form name is unique within that folder
        const isFormNameUnique = folder.forms.some(form => form.name === formName);
        if (isFormNameUnique) {
            return res.status(400).json({ message: 'Form name must be unique within this folder' });
        };

        // Create the form object
        const newForm = {
            name: formName,
            bubbles: [],    // Empty initially, will be populated later
            inputs: [],     // Empty initially, will be populated later
        };

        // Add the form to the folder's forms array
        folder.forms.push(newForm);
        await dashboard.save(); // Save the updated dashboard with the new form

        // Return the updated folder or the new form as a response
        res.status(201).json({ message: 'Form created inside folder successfully', newForm, folder });
    } catch (error) {
        console.error('Error creating form inside folder:', error);
        res.status(500).json({ message: 'Error creating form inside folder', error: error.message });
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



