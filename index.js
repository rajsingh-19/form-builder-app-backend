const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const userRoute = require("./routes/user");
const connectMongoDB = require("./config/dbconfig");

const app = express();
connectMongoDB();
const PORT = process.env.PORT || 4120;


app.use(express.json());

app.use('/api/user', userRoute);


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
