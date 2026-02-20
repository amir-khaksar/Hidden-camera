const HiddenCameraModel = require("./../models/HiddenCamera");

exports.hidden = async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ message: "Image is required." });

        const newImage = await HiddenCameraModel.create({
            image: req.file.path,
            imagePublicId: req.file.filename,
        });

        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({
            message: "Cannot save image",
            error: error.message,
        });
    }
};
