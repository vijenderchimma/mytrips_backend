const multer = require('multer');
const path = require('path');
const waterfallsModal = require('../modals/WaterfallsModal');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // limit file size to 1MB
});

const addWaterfallsData = async (req, res) => {
    try {
        const { name, state, district, url, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        console.log(image);  // Check if image is being uploaded
        const existingName = await waterfallsModal.findOne({ name });
        if (!existingName) {
            const newTrip = new waterfallsModal({
                name, state, district, url, image, description
            });
            await newTrip.save();
            res.status(201).send("Trip posted successfully");
        } else {
            res.status(400).send('Place already exists');
        }
    } catch (err) {
        res.status(500).send("Internal Server Error");
    }
};

const getWaterFallsData = async (req, res) => {
    const { state } = req.query;
    try {
        if (state) {
            const data = await waterfallsModal.find({ state });
            const filteredWaterFalls = data.filter(waterfall => waterfall.state.toLowerCase() === state.toLowerCase());
            res.json(filteredWaterFalls);
        } else {
            const data = await waterfallsModal.find();
            res.json(data);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    addWaterfallsData: [upload.single('image'), addWaterfallsData],
    getWaterFallsData
};

