const express = require('express');
const { createFolder, addFormToFolder, getFolders, deleteFolder } = require('../controller/folderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for creating folders
router.post('/:dashboardId/folder', authMiddleware, createFolder);

// Route for adding a form to an existing folder
// This will use the URL params for dashboardId, folderId, and formId
router.post('/:dashboardId/folder/:folderId/form', authMiddleware, addFormToFolder);

// Route for fetching all folders of a dashboard
router.get('/:dashboardId/folders', authMiddleware, getFolders);

// Route for deleting a folder
router.delete('/:dashboardId/folder/:folderId', authMiddleware, deleteFolder);

module.exports = router;
