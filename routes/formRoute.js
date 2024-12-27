const express = require('express');
const { createForm, getForms, deleteForm  } = require('../controller/formController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route for creating forms
router.post('/', authMiddleware, createForm);

// Route for fetching all forms for a folder
router.get('/:folderId', authMiddleware, getForms);

// Route for deleting a form
router.delete('/:id', authMiddleware, deleteForm);

module.exports = router;
