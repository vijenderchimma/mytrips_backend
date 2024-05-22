const mongoose = require('mongoose');


const templeSchema = new mongoose.Schema({
    state: String,
    district: String,
    name: String,
    url: String,
    image:String,
    description: String,
    territory: String
})

const templeModal = mongoose.model('temple',templeSchema)

module.exports = templeModal

