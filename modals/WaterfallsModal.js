const mongoose = require('mongoose');


const waterfallsSchema = new mongoose.Schema({
    state: String,
    district: String,
    name: String,
    url: String,
    image:String,
    description: String,
    territory: String
})

const waterfallsModal = mongoose.model('waterfalls',waterfallsSchema)

module.exports = waterfallsModal