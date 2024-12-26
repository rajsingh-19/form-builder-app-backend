const express = require('express');
const { createFolder, getFolders, deleteFolder } = require('../controller/folderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for creating folders
router.post('/', authMiddleware, createFolder);

// Route for fetching all folders of a user
router.get('/', authMiddleware, getFolders);

// Route for deleting a folder
router.delete('/:id', authMiddleware, deleteFolder);

module.exports = router;
