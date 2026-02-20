const express = require("express");
const cors = require("cors");
const hiddenCameraRouter = require("./routes/hiddenCamera");

const app = express();

// cors headers
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    }),
);

// parse JSON bodies
app.use(express.json());

app.use("/api/upload", hiddenCameraRouter);

module.exports = app;
