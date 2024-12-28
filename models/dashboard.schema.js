const mongoose = require('mongoose');
const FolderSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    forms: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Form' 
    }]
});

const DashboardSchema = new mongoose.Schema({
    owner: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    collaborators: [
        {
            userId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            },
            accessMode: { 
                type: String, 
                enum: ['edit', 'readonly'], 
                default: 'readonly' },
        },
    ],
    folders: [FolderSchema],
    forms: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Form' 
    }]
});

module.exports = mongoose.model('Dashboard', DashboardSchema);
