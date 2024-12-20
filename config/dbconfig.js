const mongoose = require("mongoose");
const dotenv = require("dotenv");
//configure the dotenv to load env. variable from the .env file 
dotenv.config();

const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
    } catch (err) {
        console.log(err);
    }
};

module.exports = connectMongoDB;
