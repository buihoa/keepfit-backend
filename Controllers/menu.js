const menuModel = require('../models/Menu')
const moment = require('moment')

const addMenu = ({user, menu, date}) => new Promise((resolve, reject) => {
    menuModel.create({user, menu, date})
    .then(data => resolve(data._id))
    .catch(err => reject(err))
})

const getAllMenu = ({user}) => new Promise((resolve, reject) => {
    menuModel.find({user})
    .then(data => resolve(date))
    .catch(err => reject(err))
})

const getOneMenu = ({user, date}) => new Promise((resolve, reject) => {
    menuModel.findOne({user, date})
    .then(data => resolve(data.menu))
    .catch(err => reject(err))
})

const updateMenu = (user, {date, menu}) => new Promise((resolve, reject) => {
    menuModel.findOneAndUpdate(user, {date, menu}) 
    .then(data => resolve(data._id))
    .catch(err => reject(err))
})

const deleteAllMenu = ({user}) => new Promise((resolve, reject) => {
    menuModel.findOneAndDelete({user})
    .then(data => resolve(data._id))
    .catch(err => reject(err))
})

module.exports = {addMenu, getAllMenu, getOneMenu, updateMenu, deleteAllMenu}