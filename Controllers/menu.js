const menuModel = require('../Models/Menu')
//const moment = require('moment')
const macroController = require('./macro')

const addMenu = ({user, foodIDs, date}) => new Promise((resolve, reject) => {
    menuModel.create({user, foodIDs, date})
    .then(data => resolve(data))
    .catch(err => reject(err))
})

const getAllMenu = () => new Promise((resolve, reject) => {
    menuModel.find()
    .populate('user', '_id macro')
    .populate({
        path: 'foodIDs',
        select: '_id name ingreList totalKcal protein fat carb',
        populate: {
            path: 'ingreList.reference',
            model: 'ingredient'
        }
    })
    .exec()
    .then(data => resolve(data))
    .catch(err => reject(err))
})

const getOneMenu = (_id) => new Promise((resolve, reject) => {
    menuModel.findOne({_id})
    .populate('user', '_id macro ')
    .populate({
        path: 'foodIDs',
        select: '_id name ingreList totalKcal protein fat carb',
        populate: {
            path: 'ingreList.reference',
            model: 'ingredient'
        }
    })
    .exec()
    .then(data => resolve(data))
    .catch(err => reject(err))
})

const updateMenu = ({user,date}, {foodIDs}) => new Promise((resolve, reject) => {
    menuModel.findOneAndUpdate({user, date}, {foodIDs})
    .populate('user', '_id macro ')
    .populate({
        path: 'foodIDs',
        select: '_id name ingreList totalKcal protein fat carb',
        populate: {
            path: 'ingreList.reference',
            model: 'ingredient'
        }
    })
    .exec()  
    .then(data => 
        resolve(macroController.adjustMacro(foodIDs, 
            data.user.macro.kcal,
            data.user.macro.protein)))
    .catch(err => reject(err))
})


const deleteAllMenu = ({user}) => new Promise((resolve, reject) => {
    menuModel.findOneAndDelete(user)
    .then(data => resolve(data._id))
    .catch(err => reject(err))
})

const deletelMenuTable = () => new Promise((resolve, reject) => {
    menuModel.deleteMany()
    .then(data => resolve("Successfully deleted Menu"))
    .catch(err => reject(err))
})

module.exports = {addMenu, getAllMenu, getOneMenu, updateMenu, deleteAllMenu , deletelMenuTable}