const express = require('express');
const { createFolder, addFormToFolder } = require('../controller/folderController');
const checkAccess = require('../middleware/checkAccess');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for creating folders
router.post('/:dashboardId/folder', authMiddleware, checkAccess('edit'), createFolder);

// Route for adding a form to an existing folder
// This will use the URL params for dashboardId, folderId, and formId
router.post('/:dashboardId/folder/:folderId/form', authMiddleware, checkAccess('edit'), addFormToFolder);

// Route for fetching all folders of a dashboard
router.get('/:dashboardId/folders', authMiddleware, checkAccess('view'), getFolders);

// Route for deleting a folder
router.delete('/:dashboardId/folder/:folderId', authMiddleware, checkAccess('edit'), deleteFolder);

module.exports = router;
