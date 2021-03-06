const ingredientModel = require('../Models/Ingredient')

const addIngredient = ({name,unit,kcalPerUnit,protein,fat,carb,fiber}) => 
    new Promise((resolve, reject) => {
        ingredientModel
        .create({name,unit,kcalPerUnit,protein,fat,carb,fiber})
        .then(data => resolve(data._id))
        .catch(err => reject(err));
        });

const deleteIngredient = (id) => 
    new Promise((resolve, reject) => {
        ingredientModel
        .deleteOne(id)
        .exec()
        .then(data => resolve(data._id))
        .catch(err => reject(err));
    });

/* const viewSomeIngredientbyName = ({name}) =>
    new Promise((resolve, reject) => {
        ingredientModel.find({name}) 
        .limit(30)
        .select('-active')
        .exec()
        .then(data => resolve(data))
        .catch(err => reject(err))
    })


const viewSomeIngredientbyKcal = ({kcalPerUnit}) =>
    new Promise((resolve, reject) => {
        ingredientModel.find({kcalPerUnit})
        .limit(30)
        .select('-active')
        .exec()
        .then(data => resolve({id:data}))
        .catch(err => reject(err))
}) */

const viewAllIngredients = () => 
    new Promise ((resolve, reject) => {
        ingredientModel.find({active: true})
        .sort({kcalPerUnit: 'asc'})
        .exec()
        .then(data => resolve(data)) //TODO: Look at this later
        .catch(err => reject(err))
    })


const viewOneIngredient = id => 
    new Promise((resolve, reject) => {
        ingredientModel.findById({_id: id})
        .select('-active')
        .exec()
        .then(data => resolve(data))
        .catch(err => reject(err))
    })


const updateIngredient = (id, {name, unit, kcalPerUnit, protein, fat, carb, fiber, active}) => 
    new Promise((resolve, reject) => {
        const reqBody = {name, unit, kcalPerUnit, protein, fat, carb, fiber, active}
    ingredientModel.findOne({_id: id})
    .then(data => {
        if(data === null) {
            res.status(404).json({ success: 0, message: "Not found!" })
        }
        for(key in reqBody) {
            if(data[key] && reqBody[key]) data[key] = reqBody[key]
        }
        data.save()
    })
    .then(data => resolve(data))
    .catch(err => reject(err))
    });

const deleteAllIngredient = () => new Promise((resolve, reject) => {
        ingredientModel.deleteMany()
        .then(data => resolve(data))
        .catch(err => reject(err))
})

module.exports = {
    addIngredient, deleteIngredient, viewAllIngredients, viewOneIngredient, updateIngredient,
    deleteAllIngredient
}
