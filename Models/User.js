const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {type: String, require: true},
    email: {type: String, require: true, unique: true},
    hashPassword: {type: String, require: true},
    avatar: {type: String},
    intro: {type: String},
    goal: {type: String, required: true},
    weight: {type: Number, required: true},
    height: {type: Number, required: true},
    workoutHabit: {type: String, default: '0',required: true,
    validate: {validator: validator, message: props => `${props.value} is a wrong syntax`},
    bodyFat: {type: Number, required: true},
    macro: {protein: {type: Number}, carb: {type: Number}, fat: {type: Number}}
});



function validator (input) {
    const workoutIntensity =  ['0', '1-2', '3-4', '>5']
    input = input.toLowerCase
    return workoutIntensity.includes(input)
}

UserSchema.pre("save", function(next){
    console.log(this);
    next();
})

module.exports = mongoose.model("User", UserSchema);

//TODO: gender
//TODO: validator for Goal