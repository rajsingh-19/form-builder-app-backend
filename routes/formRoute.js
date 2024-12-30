const express = require('express');
const { createForm, getForms, deleteForm  } = require('../controller/formController');
const checkAccess = require('../middleware/checkAccess');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//          Routes for forms   
// Route for creating forms
router.post('/:dashboardId/form', authMiddleware, createForm);

// Route for fetching all forms for a dashboard
router.get('/:dashboardId/forms', authMiddleware, getForms);

// Route for deleting a form
router.delete('/:formId', authMiddleware, deleteForm);     // Using formId consistently

module.exports = router;
