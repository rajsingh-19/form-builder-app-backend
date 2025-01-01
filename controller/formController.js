const FormModel = require('../models/form.schema');
const Dashboard = require('../models/dashboard.schema');

// Create Form
const createForm = async (req, res) => {
    const { formName } = req.body;
    const { dashboardId } = req.params; // Extract dashboardId from the URL

    // Validate required parameters
    if (!formName) {
        return res.status(400).json({ message: 'Form name is required' });
    }

    if (!dashboardId) {
        return res.status(400).json({ message: 'Dashboard ID is required' });
    }

    try {
        // Find the dashboard by ID
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Ensure form name is unique within this dashboard
        const isFormNameUnique = dashboard.forms.some(form => form.name === formName);
        if (isFormNameUnique) {
            return res.status(400).json({ message: 'Form name must be unique within this dashboard' });
        }

        // Create the form object
        const form = new FormModel({ name: formName, dashboardId });
        await form.save(); // Save the form in the database

        // Link the form to the dashboard
        dashboard.forms.push({ formId: form._id, name: formName });
        await dashboard.save(); // Save the updated dashboard

        res.status(201).json({
            message: 'Form created successfully',
            form,
            dashboardId,
        });
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).json({ message: 'Error creating form', error });
    }
};

// Get all forms for a dashboard
const getForms = async (req, res) => {
    const { dashboardId } = req.params;
    try {
        const forms = await FormModel.find({ dashboardId });
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching forms', error });
    }
};

// Delete a form by ID
const deleteForm = async (req, res) => {
    const { formId } = req.params;
    const { dashboardId } = req.body;

    try {
        // Check if the dashboard exists
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Check if the formId is provided
        if(!formId) {
            return res.status(404).json({ message: 'FormId not found' });
        }

        // Check if the form exists in the forms collection
        const form = await FormModel.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Find the form and remove it from the dashboard
        const formIndex = dashboard.forms.findIndex(form => form._id.toString() === formId);
        if (formIndex === -1) {
            return res.status(404).json({ message: 'Form not found' });
        }

        // Remove the folder
        dashboard.forms.splice(formIndex, 1);
        await dashboard.save();

        // Delete the actual form from the forms collection
        await form.remove();

        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ message: 'Error deleting form', error });
    }
};

module.exports = { createForm, getForms, deleteForm };
