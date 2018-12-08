const menuModel = require('../models/Menu')
const moment = require('moment')
const macroController = require('./macro')

const addMenu = ({user, menu, date}) => new Promise((resolve, reject) => {
    menuModel.create({user, menu, date})
    .then(data => resolve(data._id))
    .catch(err => reject(err))
})

const getAllMenu = ({user}) => new Promise((resolve, reject) => {
    menuModel.find({user})
    .limit(7)
    .sort({date: 1})
    .select("-modified")
    .populate('menu.foodID', 'foodName ingreList totalKcal protein carb fat')
    .exec()
    .then(data => resolve(date))
    .catch(err => reject(err))
})

const getOneMenu = ({user, date}) => new Promise((resolve, reject) => {
    menuModel.findOne({user, date})
    .select("-modified")
    .populate('menu.foodID', 'foodName ingreList totalKcal protein carb fat')
    .exec()
    .then(data => resolve(data.menu))
    .catch(err => reject(err))
})

const updateMenu = (user, {date, foodIDs}) => new Promise((resolve, reject) => {
    menuModel.findOneAndUpdate(user, {date, foodIDs})  // MenuIds is an array of foodIDs selected
    .then(data => {
        const {totalKcal, protein, carb, fat} = macroController.nutritionFactByDay(menuIDs)
        data.update({totalKcal, protein, carb, fat})
    })
    .then(data => resolve(data._id))
    .catch(err => reject(err))
})



const deleteAllMenu = ({user}) => new Promise((resolve, reject) => {
    menuModel.findOneAndDelete({user})
    .then(data => resolve(data._id))
    .catch(err => reject(err))
})


module.exports = {addMenu, getAllMenu, getOneMenu, updateMenu, deleteAllMenu}