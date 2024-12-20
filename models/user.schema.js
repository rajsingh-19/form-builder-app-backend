const mongoose = require("mongoose");
//          defining the schema
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
    }
});
//          defining the model
const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;
