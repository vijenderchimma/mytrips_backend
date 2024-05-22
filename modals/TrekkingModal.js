
const mongoose = require('mongoose');


const trekkingSchema = new mongoose.Schema({
    state: String,
    district: String,
    name: String,
    url: String,
    image:String,
    description: String,
    territory: String
})

const trekkingModal = mongoose.model('trekking',trekkingSchema)

module.exports = trekkingModal