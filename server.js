const express = require("express");

const app = express();

const PORT = 4120;


app.get('/', (req, res) => {
    res.send("Hello");
});


app.listen(PORT, () => {
    console.log(`Server is running and up on ${PORT}`);
});



