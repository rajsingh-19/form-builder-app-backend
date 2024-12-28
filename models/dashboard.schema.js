const mongoose = require('mongoose');

//          defining the folder schema
const folderSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    forms: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Form' 
    }]                  // Forms inside the folder
});

//          defining the dashboard schema
const dashboardSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    collaborators: [{
        userId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },
        accessMode: { 
            type: String, 
            enum: ['edit', 'readonly'], 
            required: true 
        },
    }],
    folders: [folderSchema],                    // Folders inside the dashboard
    forms: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Form' 
    }]                                           // Forms outside folders
});

//          defining the model
const DashboardModel = mongoose.model('Dashboard', dashboardSchema);

module.exports = DashboardModel;
