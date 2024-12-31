const FormModel = require('../models/form.schema');
const Dashboard = require('../models/dashboard.schema');

// Create Form
const createForm = async (req, res) => {
    const { userId, formName } = req.body;
    const { dashboardId } = req.params; // Extract dashboardId from the URL

    if (!dashboardId) {
        return res.status(400).json({ message: "Dashboard ID is required" });
    };

    // if (!dashboardId || !formName || !userId) {
    //     return res.status(400).json({ message: 'Dashboard Id, form name, and user ID are required' });
    // };

    try {
        //          Find the dashboard by ID
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Check if the user is the owner or has edit access
        if (dashboard.owner.toString() !== userId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Ensure form name is unique within this dashboard
        if (dashboard.forms.some(form => form.name === formName)) {
            return res.status(400).json({ message: 'Form name must be unique within this dashboard' });
        }

        // Create the form object
        const form = new FormModel({ name: formName, userId, dashboardId });
        await form.save();              // Save the form

        dashboard.forms.push({formId: form._id, formName: form.name}); // Link the form to the dashboard
        await dashboard.save();         // Save the updated dashboard

        res.status(201).json(form);     // Respond with the created form
    } catch (error) {
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

    try {
        const form = await FormModel.findById(formId);
        if (!form) {
            return res.status(404).json({ message: 'Form not found' });
        }

        await form.remove();
        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting form', error });
    }
};

module.exports = { createForm, getForms, deleteForm };
