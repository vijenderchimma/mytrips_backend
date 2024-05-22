const trekkingModal = require('../modals/TrekkingModal')

const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // limit file size to 1MB
});

const addTrekkingData = async (req,res)=>{
    try{
        const {name,state,district,url,description} = req.body
        const image = req.file ? req.file.filename: undefined
        const existingName = await trekkingModal.findOne({name})
        if(!existingName){
            const newTrip = new trekkingModal({
                name,state,district,url,image,description
            })
            await newTrip.save()
            res.status(201).send("trip posted Successfully")
        }
        else{
            res.status(400).send('Place Already Exists');
        }
    }
    catch(err){
        res.status(500).send("Internal Server Error");
    }
}

const getTrekkingData = async (req,res) => {
    const {state}= req.query

    try{

        if (state) {
            const data = await trekkingModal.find({state})
            // Filter temples by state if 'state' query parameter is provided
            const filteredTemples = data.filter(temple => temple.state.toLowerCase() === state.toLowerCase());
            res.json(filteredTemples);
          } else {
            // Send all temples if no state is specified
            const data = await trekkingModal.find()
            res.json(data);
          }

    }
    catch(err){
        console.log(err)
        res.status(500).json({message: 'server err'})
    }
}

module.exports = {addTrekkingData: [upload.single('image'),addTrekkingData],getTrekkingData}