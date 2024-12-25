const mongoose = require("mongoose");

//      define the form schema
const formSchema = new mongoose.Schema({
    formTitle: {
        type: String,
        required: true
    },
    formElements: {
        type: String,
        enum: ["bubbleText", "bubbleImgUrl", "inpText", "inptNumber", "inpEmail", "inpPhone", "inpDate", "inpRating", "inpButton"]
    },
    // Reference to the user who created the form
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

//              "forms" collection in MongoDB
const FormModel = mongoose.model("form", formSchema);

module.exports = FormModel;
