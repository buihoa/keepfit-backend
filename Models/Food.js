const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Material = new Schema({
    reference: {type: Schema.Types.ObjectId, ref: "ingredient", require: true },
    serving:{type: Number, required: true},
    flag: {type: Number, required: true} // value in {0, 1, 2, 3, 4}
}, {
    _id: false
});

const FoodSchema = new Schema({
    name: {type: String, require: true},
    ingreList: [Material],
    totalKcal: {type: Number} ,
    protein: {type: Number} ,
    carb: {type: Number},
    fat: {type: Number},
    link: {type: String}
});

module.exports = mongoose.model("food", FoodSchema);