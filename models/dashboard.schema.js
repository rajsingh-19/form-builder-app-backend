const mongoose = require('mongoose');

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
            ref: 'User',
            required: true
        },
        accessMode: { 
            type: String, 
            enum: ['edit', 'view'], 
            required: true, 
            default: 'view'
        },
    }],
    folders: [{
        name: {
            type: String,
            required: true
        },
        forms: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Form'
        }]
    }],                      // Folders inside the dashboard
    forms: [{ 
        formId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Form' 
        },
        name: { 
            type: String,
            required:  true
        }
    }]                                           // Forms outside folders
});

//          defining the model
const DashboardModel = mongoose.model('Dashboard', dashboardSchema);

module.exports = DashboardModel;
