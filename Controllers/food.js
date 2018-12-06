const foodModel = require('../models/Food')
const ingredientModel = require('../models/Ingredient')

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

const getFoodbyName = (name) => {
    new Promise((resolve, reject) => {
        foodModel.find({name: name}) //TODO: check lai phan array $in
        .sort({name: -1})
        .limit(15)
        .select('-flag')
        .populate('ingreList.ingredientID', 'name unit kcalPerUnit protein fat carb fiber')
        .exec()
    
    .then(data => resolve({id: data._id}))
    .catch(err => reject(err))
})
}

const getFoodbyIngre = (ingredient) => {
    new Promise((resolve, reject) => {
        foodModel.find({ingreList: {$in: ingredient}}) //TODO: check lai phan array $in
        .sort({name: -1})
        .limit(15)
        .select('-flag')
        .populate('ingreList.ingredientID', 'name unit kcalPerUnit protein fat carb fiber')
        .exec()
    
    .then(data => resolve({id:data}))
    .catch(err => reject(err))
})
}

const getFoodbyNutrition = (flag) => {
    new Promise((resolve, reject) => {
        foodModel.find({flag}) //TODO: check lai phan array $in
        .sort({name: -1})
        .limit(15)
        .select('-flag')
        .populate('ingreList.ingredientID', 'name unit kcalPerUnit protein fat carb fiber')
        .exec()
    .then(id => resolve({id: _id}))
    .catch(err => reject(err))
})
}

const addFood = ({name, ingreList, flag}) => {
    new Promise((resolve, reject) => {
        foodModel.create({name, ingreList, flag})
    .then(data => {
        var protein = 0
        var carb = 0 
        var fat = 0
        for(var i = 0; i < ingreList.length; i++) {
            var ingreQuery = ingredientModel.findById({_id: ingreList[i]}, (err, ingreFound) => {
                protein = protein + ingreFound.protein
                carb = carb + ingreFound.carb
                fat = fat + ingreFound.fat
            })
        }
        const totalKcal = 4*(carb + protein) + 9*fat
        data.update({totalKcal, protein, fat, carb}).exec()
    })
    .then(data => resolve({id: data._id}))
    .catch(err => reject(err))
})
}


const updateFood = (id, {name, ingreList, flag}) => {
    new Promise((resolve, reject) => {
        const reqBody = {name, ingreList, flag}
        foodModel
        .findOne({_id: id})
        .then(data => {
            if(data === null) {
                res.status(404).json({ success: 0, message: "Not found!" })
            }
            for(key in reqBody) {
                if(data[key] && reqBody[key]) data[key] = reqBody[key]
            }
            data.save().exec()
        })
        .then(data => {
            var protein = 0
            var carb = 0 
            var fat = 0
            for(var i = 0; i < ingreList.length; i++) {
                var ingreQuery = ingredientModel.findById({_id: ingreList[i]}, (err, ingreFound) => {
                    protein = protein + ingreFound.protein
                    carb = carb + ingreFound.carb
                    fat = fat + ingreFound.fat
                })
            }
            const totalKcal = 4*(carb + protein) + 9*fat
            data.update({totalKcal, protein, fat, carb}).exec()
        })
        .then(data => resolve({id: data._id}))
        .catch(err => reject(err))
    })
}

const deleteFood = (id) => {
    new Promise((resolve, reject) => {
        foodModel.deleteOne({_id: id})
        .then(data => resolve({id: data}))
        .catch(err => reject(err))
    })
}

const adjustMacro = (arrayIDs, targetMacro) => {
    new Promise((resolve, reject) => {
        const foodQueries = []
        const macroKcal = 0
        const macroProtein = 0
        const macroCarb = 0
        const macroFat = 0
        for(var i = 0; i < arrayIDs.length; i ++) {
            foodModel.findById({_id: arrayIDs[i]}, (err, foodFound) => {
                if(!foodFound) console.log("Invalid FoodID")
                else foodQueries.push(foodFound)
            })
        }

        const gapProtein  = 

        const proteinSource = filterFoodComponent(foodQueries)
        const carbSource = filterFoodCarb(foodQueries)
        const fatSource = filterFoodFat(foodQueries)
        const oilSource = filterFoodOil(foodQueries)
        console.log("Protein, Carb, Fat, Oil: ", proteinSource, carbSource, fatSource, oilSource)

        //Case when they lack Protein// over Protein
        const changedProteinIngredient = stepOne(proteinSource, gapProtein)
        
        //Case when over/not enough Calorie

    })


 //   
    //Fixing Protein Intake
function stepOne(sourceArray, gapProtein) {
    const mostDiff = {diff: 0, mark: 0}
    const leastDiff = {diff: 100, mark: 0}

    for(var i = 0; i < sourceArray.length; i++) {
        for(var j = 0; j < sourceArray[i].length; j++)
        var temp = ingredientModel.find({_id: sourceArray[i][j].ingredientID})
        var comp = temp.protein - temp.fat
        
        if(comp > mostDiff.diff) {
            mostDiff.diff = comp
            mostDiff.mark = i
        }

        if(comp < leastDiff.diff) {
            leastDiff.diff = comp  
            leastDiff.mark = i
        }
    }
    }
        const mostDiffQuerry = ingredientModel.find({_id: sourceArray[mostDiff.mark].ingredientID})
        const leastDiffQuerry = ingredientModel.find({_id: sourceArray[least.mark].ingredientID })

        if(gapProtein > 0) {
            const caloChangeMostDiff = gapProtein/mostDiffQuerry.unit * (mostDiffQuerry.protein * 4 + 9* mostDiffQuerry.fat + 4* mostDiffQuerry.carb)
            const caloChangeLeastDiff = gapProtein/leastDiffQuerry.unit * (mostDiffQuerry.protein * 4 + 9* mostDiffQuerry.fat + 4* mostDiffQuerry.carb)
            
            if(caloChangeLeastDiff >= caloChangeMostDiff) {
                return {mark: leastDiff.mark, caloChange: caloChangeLeastDiff, servingTimes: gapProtein/leastDiffQuerry.unit}
            }
            else return {mark: mostDiff.mark, caloChange: caloChangeMostDiff, servingTimes: gapProtein/mostDiffQuerry.unit}
        }

        if(gapProtein < 0) {
            const caloChangeUp = (-1)*gapProtein/mostDiffQuerry.unit * (mostDiffQuerry.protein * 4 + 9* mostDiffQuerry.fat + 4* mostDiffQuerry.carb)
            return {mark: mostDiff.mark, caloChange: caloChangeUp, servingTimes: (-1)*gapProtein/mostDiffQuerry.unit}
        }
}


function filterFoodProtein(foodArray) {
    const result = []
    const proteinItem = []
    for(var i = 0; i< foodArray.length; i++) {
        const tempIngre = foodArray[i].ingreList
        for(var j = 0; j < tempIngre.length; j++) {
            if(temp[j].flag === '1') {
                proteinItem.push(tempIngre[i])
            }
        }
        result.push(foodItem)
    }
    return result
}

function filterFoodCarb(foodArray) {
    const result = []
    const carbItem = []
    for(var i = 0; i< foodArray.length; i++) {
        const tempIngre = foodArray[i].ingreList
        for(var j = 0; j < tempIngre.length; j++) {
            if(temp[j].flag === '2') {
                carbItem.push(tempIngre[i])
            }
        }
        result.push(carbItem)
    }
    return result
}

function filterFoodFat(foodArray) {
    const result = []
    const fatItem = []
    for(var i = 0; i< foodArray.length; i++) {
        const tempIngre = foodArray[i].ingreList
        for(var j = 0; j < tempIngre.length; j++) {
            if(temp[j].flag === '3') {
                fatItem.push(tempIngre[i])
            }
        }
        result.push(fatItem)
    }
    return result
}

function filterFoodOil(foodArray) {
    const result = []
    const oilItem = []
    for(var i = 0; i< foodArray.length; i++) {
        const tempIngre = foodArray[i].ingreList
        for(var j = 0; j < tempIngre.length; j++) {
            if(temp[j].flag === '4') {
                oilItem.push(tempIngre[i])
            }
        }
        result.push(oilItem)
    }
    return result
}
module.exports = {
    addFood,getFoodbyName, deleteFood, updateFood, getAllFood, getFoodbyIngre, getFoodbyNutrition
}