const foodModel = require('../Models/Food')
const ingredientModel = require('../Models/Ingredient')

const getAllFood = page => 
    new Promise((resolve, reject) => {
        foodModel.find()
        .limit(50)
        .skip((page - 1) *5)
        .populate('ingreList.reference')
        .exec()
        .then(data => resolve(data))
        .catch(err => reject(err))
    })

const getFoodbyID = (id) => 
    new Promise((resolve, reject) => {
        foodModel.findOne({_id: id})
        .populate('ingreList.reference')
        .exec()
    .then(data => {
        data.totalKcal = 0
        data.protein = 0
        data.carb = 0
        data.fat = 0
        console.log("HERE IS ", data.ingreList)
        for(var i = 0; i < data.ingreList.length; i++ ) {
            data.totalKcal = data.totalKcal + data.ingreList[i].reference.kcalPerUnit
            data.protein = data.protein + data.ingreList[i].reference.protein
            data.carb = data.carb + data.ingreList[i].reference.carb
            data.fat = data.fat + data.ingreList[i].reference.fat
        }

        return data.save()
    })
    .then((updated) => {
        resolve(updated)
    })
    .catch(err => reject(err))
})


/* 
const getFoodbyIngre = (ingredient) => {
    new Promise((resolve, reject) => {
        foodModel.find({ingreList: {$in: ingredient}}) //TODO: check lai phan array $in
        .sort({name: 1})
        .limit(15)
        .populate('ingreList.reference', '_id name')
        .select('-flag')
        .exec()
    .then(data => resolve({id:data}))
    .catch(err => reject(err))
})
} */

/* const getFoodbyNutrition = (flag) => {
    new Promise((resolve, reject) => {
        foodModel.find({flag}) //TODO: check lai phan array $in
        .sort({name: -1})
        .limit(15)
        .populate('ingreList.ingredientID', '_id name')
        .select('-flag')
        .exec()
    .then(id => resolve({id: _id}))
    .catch(err => reject(err))
})
} */

const addFood = ({name, ingreList}) => 
    new Promise((resolve, reject) => {
        foodModel.create({name, ingreList})
    .then(data => resolve(data))
    .catch(err => reject(err))
})

const updateFood = (id, {name, ingreList}) => 
    new Promise((resolve, reject) => {
        console.log("update")
        const reqBody = {name, ingreList}
        getFoodbyID(id)
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
                return data.save()
            })
            .then((updated) => {
                resolve(updated)
            })
            .catch(err => reject(err))
    })


const deleteFood = (id) => 
    new Promise((resolve, reject) => {
        foodModel.deleteOne({_id: id})
        .then(data => resolve({id: data}))
        .catch(err => reject(err))
    })

module.exports = {
    addFood,getFoodbyID, deleteFood, updateFood, getAllFood
}