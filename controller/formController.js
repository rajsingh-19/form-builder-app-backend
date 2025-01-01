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

        // Ensure form name is unique 
        const isFormNameUnique = dashboard.forms.some(form => form.name === formName);
        if (isFormNameUnique) {
            return res.status(400).json({ message: 'Form name must be unique' });
        }

        // Create the form 
        const form = new FormModel({ name: formName, dashboardId });
        await form.save(); // Save the form in the database

        // Link the form to the dashboard
        dashboard.forms.push({ formId: form._id, name: formName });

        await dashboard.save(); // Save the updated dashboard

        // Return the updated dashboard or the new form as a response
        res.status(201).json({ message: 'Form created successfully', form, dashboardId });
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).json({ message: 'Error creating form', error });
    }
};

// Get all forms for a dashboard
const getForms = async (req, res) => {
    const { dashboardId } = req.params;
    //          Try Catch block for error handling 
    try{
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        res.status(201).json(dashboard.folders); // Return the forms inside the dashboard
    } catch (error) {
        res.status(500).json({ message: 'Error fetching forms', error });
    }
};

// Delete a form by ID
const deleteForm = async (req, res) => {
    const { formId } = req.params;
    const { dashboardId } = req.body;

    // Check if the formId is provided
    if(!formId) {
        return res.status(404).json({ message: 'FormId not found' });
    };

    try {
        // Check if the dashboard exists
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Find the form and remove it from the dashboard
        const formIndex = dashboard.forms.findIndex(form => form.formId.toString() === formId);
        if (formIndex === -1) {
            return res.status(404).json({ message: 'Form not found in dashboard' });
        }

        // Remove the folder
        dashboard.forms.splice(formIndex, 1);
        await dashboard.save();

        res.status(201).json({ message: 'Form deleted successfully' });
    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ message: 'Error deleting form', error });
    }
};

module.exports = { createForm, getForms, deleteForm };
