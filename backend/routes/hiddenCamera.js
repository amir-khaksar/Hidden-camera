const express = require("express");
const controller = require("./../controllers/hiddenCamera");
const upload = require("../configs/multer");

const router = express.Router();

router.post("/hidden", upload.single("image"), controller.hidden);

module.exports = router;
