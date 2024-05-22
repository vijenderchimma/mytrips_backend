const express = require('express')
const {addTempleData,getTempleData} = require('../controllers/templeController')

const router = express.Router()

router.post('/add-temples',addTempleData)
router.get('/get-temples',getTempleData)
router.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    res.setHeader('Content-Type', 'image/jpeg'); // Correct way to set the content type header
    res.sendFile(path.join(__dirname, '..', 'uploads', imageName));
});

module.exports = router