const FolderModel = require('../models/folder.schema');

//              Create a new folder
const createFolder = async (req, res) => {
    const { name } = req.body;          // Extract folder name from request body
    const userId = req.user.id;         // Get the user ID from the authenticated user (stored in req.user)
    //          Try Catch block for error handling 
    try {
        // Create a new folder document in the database with the user's ID and the folder name
        const newFolder = new FolderModel({
            name,
            userId
        });
        // Save the new folder to the database
        await newFolder.save();
        // Respond with a success message and a 201 status code (Created)
        res.status(201).json({ message: 'Folder created successfully' });
    } catch (error) {
        // If an error occurs, send an error response with a 500 status code (Internal Server Error)
        res.status(500).json({ message: 'Error creating folder', error });
    }
};

//              Get all folders for the user
const getFolders = async (req, res) => {
    const userId = req.user.id;           // Get the user ID from the authenticated user (stored in req.user)
    //          Try Catch block for error handling 
    try {
        // Find all folders associated with the user's ID
        const folders = await FolderModel.find({ userId });
        // Respond with the list of folders and a 200 status code (OK)
        res.status(200).json(folders);
    } catch (error) {
        // If an error occurs while fetching folders, send an error response with a 500 status code
        res.status(500).json({ message: 'Error fetching folders', error });
    }
};

//              Delete a folder by ID
const deleteFolder = async (req, res) => {
    const { id } = req.params;              // Extract the folder ID from the URL parameters
    //          Try Catch block for error handling 
    try {
        // Delete the folder from the database by its ID
        await FolderModel.findByIdAndDelete(id);
        // Respond with a success message and a 200 status code (OK)
        res.status(200).json({ message: 'Folder deleted successfully' });
    } catch (error) {
        // If an error occurs while deleting the folder, send an error response with a 500 status code
        res.status(500).json({ message: 'Error deleting folder', error });
    }
};

module.exports = { createFolder, getFolders, deleteFolder };
