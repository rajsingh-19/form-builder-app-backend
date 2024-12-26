const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
//          import the routes
const authRoute = require("./routes/authRoute");
const userSettingsRoute = require('./routes/userRoute');
const folderRoute = require("./routes/folderRoute");
//          import the db configuration
const connectMongoDB = require("./config/dbconfig");

const app = express();          // Creating an Express application instance
connectMongoDB();               // Calling the function to connect to MongoDB
dotenv.config();                // Loading environment variables from .env file

app.use(cors());                // Enabling Cross-Origin Resource Sharing
app.use(express.json());        // Middleware to parse JSON bodies in requests

const PORT = process.env.PORT || 4120;      // Defining the port for the server, defaulting to 4120 if not set in .env

// Defining a route for user-related operations, prefixed with /api/use
app.use('/api/auth', authRoute);            // Auth user routes
app.use('/api/user', userSettingsRoute);    // user update routes
app.use('/api/folder', folderRoute);        // Folder routes

// Defining a simple root route for the application
app.get('/', (req, res) => {
    res.send("Hello");
});

//          wait for the db connection before starting the server
mongoose.connection.once('open', () => {
    console.log("Database Connected");
    //      starting the server after the db connection is established
    app.listen(PORT, () => {
        console.log(`Server is running and up on ${PORT}`);
    });
}) 

//          error handling for db connection issues
mongoose.connection.on('error', (err) => {
    console.error(`Database Connection Error ${err}`);
});
