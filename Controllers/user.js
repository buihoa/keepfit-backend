const userModel = require('../Models/User')

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
            .select('-hashPassword')
            .limit(1)
            .exec()
            .then(data => resolve(data))
            .catch(err => reject(err))
    });

const addUser = ({
        name,
        avatar,
        intro,
        goal,
        weight,
        height,
        workoutHabit,
        bodyFat
    }) =>
    new Promise((resolve, reject) => {
        userModel.create({
                name,
                avatar,
                intro,
                goal,
                weight,
                height,
                workoutHabit,
                bodyFat
            })
            .then(data => {
                const macro = macroCalculated(data.goal, data.weight, data.bodyFat, data.workoutHabit)
                data.update({
                    macro: macro
                })
            })
            .then(data => resolve({
                id: data._id
            }))
            .catch(err => reject(err));
    });

const macroCalculated = (goal, weight, bodyFat, workoutHabit) => {
    var maintainKcal = 0
    if (goal === 'loseFat') {
        const lean = weight * (1 - bodyFat)

        if (workoutHabit === '0' || workoutHabit === '1-2') maintainKcal = weight * 15 * 2
        if (workoutHabit === '3-4' || workoutHabit === '>5') maintainKcal = weight * 17 * 2

        var fatLossPercent = 0
        if (weight < 55) fatLossPercent = 0.06
        else if (55 <= weight && weight < 80) fatLossPercent = 0.08
        else fatLossPercent = 0.1

        const fatLossWeight = weight * fatLossPercent
        const totalBodyWeightLoss = fatLossWeight / 0.713

        const weightLossPerWeek = totalBodyWeightLoss * 0.8 / 100

        const calorieDeficit = (weightLossPerWeek * (0.713 * 0.87 * 9 + 0.287 * 0.3 * 4)) / 7
        const protein = 2.3 * lean
        const finalKcal = maintainKcal - calorieDeficit
        var fat = 50;
        var carb = 100
        var remainK = finalKcal
        while (carb < fat ||
            remainK < (maintainKcal - 100) || remainK > (maintainKcal + 100)) {
            fat = Math.floor(Math.random() * 150)
            carb = Math.floor(Math.random() * 300)
            remainK = finalKcal - 4 * carb - 9 * fat
        }
        return {
            finalKcal,
            protein,
            carb,
            fat
        }
    }
}

const updateUser = (id, {
        name,
        avatar,
        intro,
        goal,
        weight,
        height,
        workoutHabit,
        bodyFat
    }) =>
    new Promise((resolve, reject) => {
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
                data.save().exec()
            })
            .then(data => resolve({
                id: data._id
            }))
            .catch(err => reject(err));
    });

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