const mongoose = require("mongoose");

//          defining the user schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    }, 
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    dashboards: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Dashboard' 
    }]
});

//          defining the model
const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
