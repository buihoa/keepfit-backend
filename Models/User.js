const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    hashPassword: {type: String, require: true},
    avatar: {type: String},
    intro: {type: String},
    goal: {type: Number, default: 0},
    weight: {type: Number, default: 1},
    height: {type: Number, default: 1},
    workoutHabit: {type: Number, default: 1},
    bodyFat: {type: Number, default: 1},
    macro: {kcal: {type: Number, default: 0}, 
    protein: {type: Number, default: 0}, 
    carb: {type: Number, default: 0}, 
    fat: {type: Number, default: 0}}
});

/* function validator (input) {
    const workoutIntensity =  ['0', '1-2', '3-4', '>5']
    input = input.toLowerCase
    return workoutIntensity.includes(input)
}
 */

UserSchema.pre("save", function(next){
    console.log(this);
    next();
})

module.exports = mongoose.model("user", UserSchema);

//TODO: gender
//TODO: validator for Goal