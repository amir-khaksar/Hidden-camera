const express = require("express");
const cors = require("cors");

const app = express();

// cors headers
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true,
    }
));

// parse JSON bodies
app.use(express.json())

module.exports = app;