const foodModel = require('../Models/Food')

const getAllFood = page => 
    new Promise((resolve, reject) => {
        foodModel.find()
        .limit(50)
        .skip((page - 1) *5)
        .select('-flag')
        .exec()
        .then(data => resolve(data))
        .catch(err => reject(err))
    })

const getFoodbyID = (id) => 
    new Promise((resolve, reject) => {
        foodModel.find({_id: id})
        .sort({name: -1})
        .limit(15)
        .populate('ingreList', '_id name')
        .select('-flag')
        .exec()
    .then(data => resolve(data))
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
        console.log({name, ingreList})
        foodModel.create({name, ingreList})
    .then(data => resolve(data))
    .catch(err => reject(err))
})

const updateFood = (id, {name, ingreList, flag}) => 
    new Promise((resolve, reject) => {
        const reqBody = {name, ingreList, flag}
        foodModel
        .findOne({_id: id})
        .then(data => resolve({id: data._id}))
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