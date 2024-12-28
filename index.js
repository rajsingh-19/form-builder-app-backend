const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
//          Import the routes
const userRoutes = require("./routes/userRoute");
const dashboardRoutes = require('./routes/dashboardRoute');
const folderRoutes = require("./routes/folderRoute");
const formRoutes = require("./routes/formRoute");
const sharingRoutes = require('./routes/sharingRoute');
//          Import the db configuration
const connectMongoDB = require("./config/dbconfig");

const app = express();          // Creating an Express application instance
connectMongoDB();               // Calling the function to connect to MongoDB
dotenv.config();                // Loading environment variables from .env file

app.use(cors());                // Enabling Cross-Origin Resource Sharing
app.use(express.json());        // Middleware to parse JSON bodies in requests

const PORT = process.env.PORT || 4120;      // Defining the port for the server, defaulting to 4120 if not set in .env

//          Defining all the api routes
app.use('/api/auth', userRoutes);                       // Auth user routes
app.use('/api/dashboards', dashboardRoutes);            // dashboard routes
app.use('/api/folders', folderRoutes);                  // Folder routes
app.use('/api/forms', formRoutes);                       // Form routes
app.use('/api/sharing', sharingRoutes);                 // Sharing routes

//          Defining a simple root route for the application
app.get('/', (req, res) => {
    res.send("Hello");
});

//          Handling Undefined Routes
app.use("*", (req, res) => {
    res.status(404).json({ message: "Route not found" });
});

//          Error Handling Middleware
app.use((error, req, res, next) => {
    console.log(error);
    res.status(500).json({ errorMessage: "Something went wrong" });
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
