const mongoose = require('mongoose');
const Schema = mongoose.Schema

const menuSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'user', required: true},
    date: {type: Date,
        default: function() {
        var date = new Date()
        date.setHours(0, 0, 0, 0)
        return date}
        , required: true}, 
    foodIDs: [{type: Schema.Types.ObjectId, ref: 'food', required: true}],
    totalKcal: {type: Number},
    protein: {type: Number},
    carb: {type: Number},
    fat: {type: Number},
    modified: {type: Date, default: Date.now()}
}) 


module.exports = mongoose.model('menu', menuSchema)
