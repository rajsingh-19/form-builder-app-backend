const mongoose = require('mongoose');
//          defining the folder schema  
const folderSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true
    },
    dashboardId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Dashboard', 
        required: true 
    },
    forms: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Form' 
    }]
});

//      defining the model  
const FolderModel = mongoose.model("Folder", folderSchema);

module.exports = FolderModel;
