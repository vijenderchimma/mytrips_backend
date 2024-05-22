const express = require('express')

const {addTrekkingData,getTrekkingData} = require('../controllers/trekkingController')
const { route } = require('./templeRoutes')

const router = express.Router()

router.post('/add-trekking',addTrekkingData)
router.get('/get-trekking',getTrekkingData)
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.setHeader('Content-Type', 'image/jpeg'); // Correct way to set the content type header
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});
module.exports = router