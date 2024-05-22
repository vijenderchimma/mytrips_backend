const express = require('express');
const { addWaterfallsData, getWaterFallsData } = require('../controllers/waterfallsController');

const router = express.Router();

router.post('/add-waterfalls', addWaterfallsData);
router.get('/get-waterfalls', getWaterFallsData);

router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.setHeader('Content-Type', 'image/jpeg'); // Correct way to set the content type header
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

module.exports = router;
