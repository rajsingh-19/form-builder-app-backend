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
            required: true,
            unique: true
        },
        forms: [{
            name: { 
                type: String,
                required: true, // Form name is now required within the folder
                unique: true
            },
            bubbles: [{
                type: String,                   // Text-based bubbles or URL images
                content: { 
                    type: String, 
                    required: true 
                }
            }],
            inputs: [{
                type: String,                   // Types of input fields (text, number, email, etc.)
                placeholder: { 
                    type: String, 
                    required: true 
                }
            }],
            views: { 
                type: Number, 
                default: 0 
            },                                  // Tracks number of views
            starts: { 
                type: Number, 
                default: 0 
            },                                  // Tracks number of starts
            completions: { 
                type: Number, 
                default: 0 
            }
        }]
    }],                      // Folders inside the dashboard
    forms: [{ 
        name: { 
            type: String,
            required: true,
            unique: true
        },
        bubbles: [{
            type: String,                   // Text-based bubbles or URL images
            content: { 
                type: String, 
                required: true 
            }
        }],
        inputs: [{
            type: String,                   // Types of input fields (text, number, email, etc.)
            placeholder: { 
                type: String, 
                required: true 
            }
        }],
        views: { 
            type: Number, 
            default: 0 
        },                                  // Tracks number of views
        starts: { 
            type: Number, 
            default: 0 
        },                                  // Tracks number of starts
        completions: { 
            type: Number, 
            default: 0 
        }
    }]                                           // Forms outside folders
});

//          defining the model
const DashboardModel = mongoose.model('Dashboard', dashboardSchema);

module.exports = DashboardModel;
