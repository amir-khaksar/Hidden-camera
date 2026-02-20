const app = require("./app");
const mongoose = require("mongoose");
require("dotenv").config();

const port = process.env.PORT || 3000;

(async () => {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB Connected")
})();

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
