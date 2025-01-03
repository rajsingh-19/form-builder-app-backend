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

        // Create the form object to be added to the dashboard
        const newForm = { 
            name: formName,
            bubbles: [],  // Empty initially, will be populated later
            inputs: [],   // Empty initially, will be populated later
        };

        // Add the form to the general forms array (no folderId handling)
        dashboard.forms.push(newForm);
        await dashboard.save(); // Save the updated dashboard

        // Return the updated dashboard or the new form as a response
        res.status(201).json({ message: 'Form created successfully', newForm, dashboardId });
    } catch (error) {
        console.error('Error creating form:', error);
        res.status(500).json({ message: 'Error creating form', error: error.message });
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

//  Get a form by id 
const getFormById = async (req, res) => {
    const { formId, dashboardId, folderId } = req.params;
    
    // Validate the form ID parameter 
    if(!formId) {
        return res.status(404).json({ message: "Form Id is required "});
    };
    
    // Validate the dashboard ID parameter
    if(!dashboardId) {
        return res.status(404).json({ message: "Dashboard Id is required "});
    };

    try {
        const dashboard = await Dashboard.findById(dashboardId);
        if(!dashboard) {
            return res.status(404).json({ message: "Dashboard not found "});
        };

        // Check if the form exists in the dashboard forms
        let requiredForm = dashboard.forms.find(form => form._id.toString() === formId);
        
        if (requiredForm) {
            return res.status(200).json(requiredForm); // Form found in dashboard.forms
        };

        // If no folderId is provided, form must be in dashboard.forms
        if (!folderId) {
            return res.status(404).json({ message: "Form not found in dashboard" });
        };
            
        const folder = dashboard.folders.find(folder => folder._id.toString() === folderId);
        if(folder) {
            const requiredForm = folder.forms.find(form => form._id.toString() === formId);
            if(requiredForm) {
                return res.status(200).json(requiredForm);
            } else {
                return res.status(404).json({ message: "Form not found in folder" });
            }
        } else {
            return res.status(404).json({ message: "Folder not found" });
        }
    } catch (error) {
        console.error("Error getting the form", error);
        res.status(500).json({ message: 'Error fetchin form', error });
    }
}; 

//  Delete the form with the formId
const deleteForm = async (req, res) => {
    const { formId } = req.params;
    const { dashboardId } = req.body;

    if (!formId) {
        return res.status(404).json({ message: 'FormId not found' });
    }

    try {
        // Check if the dashboard exists
        const dashboard = await Dashboard.findById(dashboardId);
        if (!dashboard) {
            return res.status(404).json({ message: 'Dashboard not found' });
        }

        // Try deleting the form from the forms array (outside folders)
        const formIndex = dashboard.forms.findIndex(form => form._id.toString() === formId);
        if (formIndex !== -1) {
            dashboard.forms.splice(formIndex, 1); // Remove form from forms array
        } else {
            // Try deleting from the folders
            let formFound = false;
            for (let i = 0; i < dashboard.folders.length; i++) {
                const folder = dashboard.folders[i];
                const formIndexInFolder = folder.forms.findIndex(form => form._id.toString() === formId);
                if (formIndexInFolder !== -1) {
                    folder.forms.splice(formIndexInFolder, 1); // Remove form from the folder
                    formFound = true;
                    break;
                }
            }

            if (!formFound) {
                return res.status(404).json({ message: 'Form not found in folders' });
            }
        }

        // Save the dashboard after modifications
        await dashboard.save();
        res.status(200).json({ message: 'Form deleted successfully' });

    } catch (error) {
        console.error('Error deleting form:', error);
        res.status(500).json({ message: 'Error deleting form', error });
    }
};

module.exports = { createForm, getForms, getFormById, deleteForm };
