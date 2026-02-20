const mongoose = require("mongoose");

const schema = new mongoose.Schema(
    {
        image: {
            required: true,
            type: String,
            default: "",
        },
    },
    { timestamps: true },
);

const model = mongoose.model("HiddenCamera", schema);

module.exports = model;
