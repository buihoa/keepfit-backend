const mongoose = require('mongoose');
const Schema = mongose.Schema

const menuSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    date: {type: Date, require: true, unique: true}, //TODO: Need to set hour, second,.. to 0
    foodIDs: {type: Array[{foodID: {type: Schema.Types.ObjectId, ref: 'food', required: true},
    serving: {type: Number, required:true}}]},
    totalKcal: {type: Number},
    protein: {type: Number},
    carb: {type: Number},
    fat: {type: Number},
    modified: {type: Date, default: Date.now()}
}) 

module.exports = mongoose.model('menu', menuSchema)