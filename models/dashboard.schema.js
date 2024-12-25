const mongoose = require("mongoose");

//      define the form schema
const dashboardSchema = mongoose.Schema({
    // Field to store the creator's name
    creatorName: {
        type: String,
        required: true
    },
    // Field to store an array of folders
    folder: [
        {
            name: { 
                type: String, 
                required: true,          // Each folder must have a name 
                unique: true             // Ensure folder names are unique at the database level
            },
            forms: [
                {
                    title: { 
                        type: String, 
                        required: true // Each form must have a title
                    }
                }
            ]
        }
    ],
    // Field to store the form name or identifier
    form: {
        type: String,
        required: true,
        unique: true
    },
    // Field to reference the user who created the dashboard
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

//              "dashboard" collection in MongoDB
const DashboardModel = mongoose.model("dashboard", dashboardSchema);

module.exports = DashboardModel;
