const mongoose = require("mongoose");

//      define the form schema
const formSchema = new mongoose.Schema({
    formTitle: {
        type: String,
        required: true
    },
    formElements: {
        bubbles: [{ type: String }],
        inputs: [{ type: String }]
    },
    folderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Folder' 
    },
    // Reference to the user who created the form
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

//              "forms" collection in MongoDB
const FormModel = mongoose.model("form", formSchema);

module.exports = FormModel;
