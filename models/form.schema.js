const mongoose = require('mongoose');

//          defining the form schema
const formSchema = new mongoose.Schema({
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
    }                                  // Tracks number of completions
});

//          defining the model
const FormModel = mongoose.model('Form', formSchema);

module.exports = FormModel;
