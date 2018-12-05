const userModel = require('../models/User')

const getAllUsers = page => 
    new Promise((resolve, reject) => {
        userModel.find()
        .limit(30)
        .skip((page - 1) * 5)
        .select('-hashPassword -intro')
        .exec()
        .then(data => resolve({data}))
        .catch(err => reject(err));
    });

const getOneUser = id => 
    new Promise((resolve, reject) => {
        userModel.findOne({_id: id})
        .select('-hashPassword')
        .limit(1)
        .exec()
        .then(data => resolve(data))
        .catch(err => reject(err))
    })

const addUser = ({name, avatar, intro, goal, weight, height, workoutHabit, bodyFat}) => 
    new Promise ((resolve, reject) {
    userModel.create({name, avatar, intro, goal, weight, height, workoutHabit, bodyFat})
    .then(data => {
        
    })
    .then(data => resolve({id: data._id}))
    .catch(err => reject(err));
    });

const macroCalculated = (goal, height, weight, bodyFat, workoutHabit) => {
    const macro =  {kcal, protein, carb, fat} 

    if(goal === 'loseFat') {
        const fatMass = weight * bodyFat
        const fatLossPercent
        if(weight < 55) fatLossPercent = 0.06
        else if(55<= weight && weight < 80) fatLossPercent = 0.08
        else fatLossPercent = 0.1

        const fatLossWeight = weight * fatLossPercent
        const totalBodyWeightLoss = fatLossWeight/0.713

        const weightLossPerWeek = totalBodyWeightLoss * 0.8/100

        const calorieDeficit = (weightLossPerWeek*(0.713*0.87*9 + 0.287*0.3*4))/7
    }
}

const updateUser = (id, {name, avatar, intro, goal, weight, height, workoutHabit, bodyFat}) => 
    new Promise((resolve, reject) => {
        const reqBody = {name, avatar, intro, goal, weight, height, workoutHabit, bodyFat}
        userModel.findOne({_id: id})
        .then(data => {
            if(data === null) {
                res.status(404).json({ success: 0, message: "Not found!" })
            }
            for(key in reqBody) {
                if(data[key] && reqBody[key]) data[key] = reqBody[key]
            }
            data.save().exec()
        })
        .then(data => resolve({id: data._id}))
        .catch(err => reject(err));
    });

const deleteUser = ({id}) => 
    new Promise((resolve, reject) => {
        userModel.findByIdAndDelete(id)
        .then(data => resolve({id: data_id}))
        .catch(err => reject(err));
    });

module.exports = {
    addUser, getOneUser, getAllUsers, deleteUser, updateUser
};