const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodSchema = new Schema({
    foodName: {type: String, required: true},
    ingreList: {type: [{ingredientID: {type: Schema.Types.ObjectId, 
        ref: 'ingredient', required: true}, 
        serving:{type: Number, default: 1, required: true} ,
        flag: {type: Number, 
            required: true,
            validate: {validator: validator, message: `This has to be one of these flags below
            0: no priority,
            1: high protein,
            2: high carb,
            3: high fat,
            4: cooking oil`}, default: 0, required: true}
    }], required: true},
    totalKcal: {type: Number} ,
    protein: {type: Number} ,
    carb: {type: Number},
    fat: {type: Number}
    })

function validator(v) {
    return input === 1 || input === 2 || input === 3 || input === 4
}
module.exports = mongoose.model("food", FoodSchema);