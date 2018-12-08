const userModel = require('../Models/User')
const bcrypt = require("bcrypt-nodejs");

const getAllUsers = page =>
    new Promise((resolve, reject) => {
        userModel.find()
            .limit(30)
            .skip((page - 1) * 5)
            .select('-hashPassword -intro')
            .exec()
            .then(data => resolve({
                data
            }))
            .catch(err => reject(err));
    });

const getOneUser = id =>
    new Promise((resolve, reject) => {
        userModel.findOne({
                _id: id
            })
            .limit(1)
            .select('-hashPassword')
            .exec()
            .then(data => resolve(data))
            .catch(err => reject(err))
    });

const addUser = ({
        name, email, password
    }) => {
    const hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
    return new Promise((resolve, reject) => {
        userModel.create({
                name,
                hashPassword,
                email
            })
            .then(data => resolve(data))
            .catch(err => reject(err));
        }
    )
    };


const macroCalculated = (goal, weight, bodyFat, workoutHabit) => {
    let maintainKcal = 0
    if (goal === 0) {
        const lean = weight * (1 - bodyFat/100)

        if (workoutHabit === 0 || workoutHabit === 1) maintainKcal = weight * 15 * 2
        if (workoutHabit === 3 || workoutHabit === 5) maintainKcal = weight * 17 * 2

        console.log("Maintain Kcal is ", maintainKcal)
        var fatLossPercent = 0
        if (bodyFat < 22) fatLossPercent = 0.06
        else if (23 <= bodyFat && bodyFat < 28) fatLossPercent = 0.08
        else fatLossPercent = 0.1
        console.log("fatLossPercent: ", fatLossPercent)

        const fatLossWeight = weight * fatLossPercent
        console.log("fat loss Weight is: ", fatLossWeight)

        const totalBodyWeightLoss = fatLossWeight / 0.713
        console.log(totalBodyWeightLoss)

        const weightLossPerWeek = weight * 0.7/100

        const calorieDeficit = (weightLossPerWeek * 1000 * (0.713 * 0.87 * 9 + 0.287 * 0.3 * 4)) / 7
        console.log("Calorie Deficit: ", calorieDeficit)
        const protein = Math.floor(2.6 * lean)
        const finalKcal = Math.floor(maintainKcal - calorieDeficit)
        console.log("finalKcal is ", finalKcal)
        let fat = 1
        let carb = 0
        let remainK = finalKcal
        while (carb < fat ||
            remainK < (finalKcal - 100) || remainK > (finalKcal + 100)) {
            fat = Math.floor(Math.random() * 150)
            carb = Math.floor(Math.random() * 300)
            remainK = 4*(protein + carb) + 9*fat
            }
        return {
            finalKcal,
            protein,
            carb,
            fat
        }
    }
}

const testMACRO = macroCalculated(0, 70, 25, 1)
console.log("TEST MACRO IS: ", testMACRO)

//UPDATE PASSWORD
const updateUser = (id, {
        name,
        avatar,
        intro,
        goal,
        weight,
        height,
        workoutHabit,
        bodyFat
    }) => {

    const reqBody = {
        name,
        avatar,
        intro,
        goal,
        weight,
        height,
        workoutHabit,
        bodyFat
    }
    return new Promise((resolve, reject) => {
        userModel.findOne({
                _id: id
            })
            .then(data => {
                if (data === null) {
                    res.status(404).json({
                        success: 0,
                        message: "Not found!"
                    })
                }
                for (key in reqBody) {
                    if (data[key] && reqBody[key]) data[key] = reqBody[key]
                }
            })
            data.save()
            .then(data => resolve({
                data
            }))
            .catch(err => reject(err));
        })
    };


const deleteUser = ({
        id
    }) =>
    new Promise((resolve, reject) => {
        userModel.findByIdAndDelete(id)
            .then(data => resolve({
                id: data_id
            }))
            .catch(err => reject(err));
    });

module.exports = {
    addUser,
    getOneUser,
    getAllUsers,
    deleteUser,
    updateUser
};