const ingredientModel = require('../Models/Ingredient')
const foodModel = require('../Models/Food')
const menuModel = require('../Models/Menu')
const _ = require('lodash')

//Pass down the menu selected from Menu Controller
const adjustMacro = (foodIDs, {macroTotalKcal, macroProtein, macroCarb, macroFat}) => { 
    new Promise((resolve, reject) => {
        const foodQueries = []
        for(var i = 0; i < foodIDs.length; i ++) {
            foodModel.findById({_id: foodIDs[i]}, (err, foodFound) => { //foodIDs[]
                if(!foodFound) reject("Invalid FoodID")
                else foodQueries.push(foodFound.ingreList) // FoodQueries[foodItem from food Models]
            })
        }

        const {curTotalKcal, curProtein, curCarb, curFat} = defaultNutrition(foodIDs)

        const gapProtein  = curProtein - macroProtein
        let gapKcal = curTotalKcal - macroTotalKcal

        const proteinSource = filterFoodProtein(foodQueries)
        const carbSource = filterFoodCarb(foodQueries)
        const fatSource = filterFoodFat(foodQueries)
        const oilSource = filterFoodOil(foodQueries)
        console.log("Protein, Carb, Fat, Oil: ", proteinSource, carbSource, fatSource, oilSource)

        //Case when they lack Protein// over Protein
        const {markProtein, idProtein, caloChangeProtein, servingTimesProtein} = stepOne(proteinSource, gapProtein)
        gapKcal = gapKcal + caloChangeProtein

        foodQueries[markProtein].ingreList[idProtein].serving = servingTimesProtein


        //Case when over/not enough Calorie
        

        resolve()
    })

const defaultNutrition = async (foodIDs) => {
        var curProtein = 0
        var curCarb = 0 
        var curFat = 0
        for(var i = 0; i < foodIDs.length; i++) {
                let ingreQuery = await ingredientModel.findById({_id: foodIDs[i]}, (err, ingreFound) => {
                    protein = protein + ingreFound.protein
                    carb = carb + ingreFound.carb
                    fat = fat + ingreFound.fat
                })
            }
        const totalKcal = 4*(carb + protein) + 9*fat
        return {curTotalKcal, curProtein, curCarb, curFat}
    }

//Fixing Protein Intake
async function stepOne(sourceArray, gapProtein) { //sourceArray [[ingreId, flag]]
    const mostDiff = {id: 0, diff: 0, mark: 0, unit: 0}
    const leastDiff = {id: 0, diff: 100, mark: 0, unit: 0}

    for(var i = 0; i < sourceArray.length; i++) {
        for(var j = 0; j < sourceArray[i].ingreList.length; j++)
        var temp = await ingredientModel.find({_id: sourceArray[i].ingreList[j].ingredientID})
        var comp = temp.protein - temp.fat
        
        if(comp > mostDiff.diff) {
            mostDiff.id = j
            mostDiff.diff = comp
            mostDiff.mark = i
        }

        if(comp < leastDiff.diff) {
            leastDiff.id = j
            leastDiff.diff = comp  
            leastDiff.mark = i
        }
    }
        const mostDiffQuerry = ingredientModel.find({_id: mostDiff.id})
        const leastDiffQuerry = ingredientModel.find({_id: leastDiff.id})

        if(gapProtein > 0) {
            const caloChangeMostDiff = -gapProtein/mostDiff.unit * (mostDiffQuerry.protein * 4 + 9* mostDiffQuerry.fat + 4* mostDiffQuerry.carb)
            const caloChangeLeastDiff = -gapProtein/leastDiffQuerry.unit * (leastDiffQuerry.protein * 4 + 9* leastDiffQuerry.fat + 4* leastDiffQuerry.carb)
            
            if(caloChangeLeastDiff >= caloChangeMostDiff) {
                return {markProtein: leastDiff.mark, ingreID: leastDiff.d ,caloChangeProtein: caloChangeLeastDiff, servingTimesProtein: gapProtein/leastDiffQuerry.unit}
            }
            else return {markProtein: mostDiff.mark, idProtein: mostDiff.id, caloChangeProtein: caloChangeMostDiff, servingTimesProtein: gapProtein/mostDiffQuerry.unit}
        }

        if(gapProtein < 0) {
            const caloChangeUp = (-1)*gapProtein/mostDiffQuerry.unit * (mostDiffQuerry.protein * 4 + 9* mostDiffQuerry.fat + 4* mostDiffQuerry.carb)
            return {markProtein: mostDiff.mark, idProtein: mostDiff.id, caloChangeProtein: caloChangeUp, servingTimesProtein: (-1)*gapProtein/mostDiffQuerry.unit}
        }
}

//Change fat-rich items
async function stepTwo (sourceArray, gapKcal) {
    let count = 0
    let 
    while(count < gapKcal) {
        let query = ingredientModel.findById(sourceArray.ingredientID)

        query
    }
}

function filterFoodProtein(foodArray) {
    return foodArray.map(food => food.ingreList.filter(ingre => ingre.flag === '1')); //FoodArray [[flag === 1]]
}
function filterFoodCarb(foodArray) {
    return foodArray.map(food => food.ingreList.filter(ingre => ingre.flag === '2'));
}
function filterFoodFat(foodArray) {
    return foodArray.map(food => food.ingreList.filter(ingre => ingre.flag === '3'));
}
function filterFoodOil(foodArray) {
    return foodArray.map(food => food.ingreList.filter(ingre => ingre.flag === '4'));
}

module.exports = {
    nutritionFactByDay
}