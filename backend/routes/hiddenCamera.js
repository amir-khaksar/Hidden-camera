const express = require("express");
const controller = require("./../controllers/hiddenCamera");

const router = express.Router();

router.post("/hidden", controller.hidden);
