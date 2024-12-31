const FormModel = require('../models/form.schema');
const FolderModel = require('../models/folder.schema'); 
const Dashboard = require('../models/dashboard.schema');

// Create Form
const createForm = async (req, res) => {
    const { userId, formName, folderId = null } = req.body;
    const { dashboardId } = req.params; // Extract dashboardId from the URL

    if (!dashboardId || !formName || !userId) {
        return res.status(400).json({ message: 'Dashboard Id, form name, and user ID are required' });
    };

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

        // Ensure folder name is unique within this dashboard
        if (dashboard.forms.some(form => form.name === formName)) {
            return res.status(400).json({ message: 'Form name must be unique' });
        }

        let form;
        
        // If a folderId is provided, associate the form with that folder
        if (folderId) {
            const folder = await FolderModel.findById(folderId);
            if (!folder) {
                return res.status(404).json({ message: 'Folder not found' });
            }

            form = new FormModel({ name: formName, dashboardId, folderId });
            folder.forms.push(form._id); // Link the form to the folder
            await folder.save();
        } else {
            // If no folderId is provided, create the form without associating it to any folder
            form = new FormModel({ name: formName, dashboardId });
        }

        await form.save();              // Save the form

        dashboard.forms.push(form._id); // Link the form to the dashboard
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
