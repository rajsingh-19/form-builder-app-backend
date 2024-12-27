const FormModel = require('../models/form.schema');

// Create a new form
const createForm = async (req, res) => {
    const { formTitle, formElements, folderId } = req.body;
    const userId = req.user.id;

    try {
        const newForm = new FormModel({
            formTitle,
            formElements,
            folderId,
            userId
        });
        await newForm.save();
        res.status(201).json({ message: 'Form created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error creating form', error });
    }
};

// Get all forms for a folder
const getForms = async (req, res) => {
    const { folderId } = req.params;

    try {
        const forms = await FormModel.find({ folderId });
        res.status(200).json(forms);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching forms', error });
    }
};

// Delete a form by ID
const deleteForm = async (req, res) => {
    const { id } = req.params;

    try {
        await FormModel.findByIdAndDelete(id);
        res.status(200).json({ message: 'Form deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting form', error });
    }
};

module.exports = { createForm, getForms, deleteForm };
