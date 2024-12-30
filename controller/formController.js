const FormModel = require('../models/form.schema');
const Dashboard = require('../models/dashboard.schema');

// Create Form
const createForm = async (req, res) => {
    const { dashboardId } = req.params; // Extract dashboardId from the URL
    const { formName, bubbles, inputs } = req.body;

    try {
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        const form = new FormModel({ name: formName, dashboardId, bubbles, inputs });
        await form.save();

        dashboard.forms.push(form._id); // Link the form to the dashboard
        await dashboard.save();

        res.status(201).json(form);
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
