const ingredientModel = require('../Models/Ingredient')
const foodModel = require('../Models/Food')
const menuModel = require('../Models/Menu')
const _ = require('lodash')
const ingredientController = require('./ingredients')

//Pass down the menu selected from Menu Controller
const adjustMacro = (foodIDs, {macroTotalKcal, macroProtein, macroCarb, macroFat}) => { 
    new Promise((resolve, reject) => {
        const foodQueries = []
        for(let i = 0; i < foodIDs.length; i ++) {
            foodModel.findById({_id: foodIDs[i]}, (err, foodFound) => { //foodIDs[]
                if(!foodFound) reject("Invalid FoodID")
                else {
                    foodFound.
                    foodQueries.push(foodFound) // FoodQueries[foodItem from food Models]
                }
            })
        }

        //Getting target in to const
        const {curTotalKcal, curProtein, curCarb, curFat} = defaultNutrition(foodQueries)
        const gapProtein  = curProtein - macroProtein
        

        let proteinSource = filterFoodProtein(foodQueries)
        const carbSource = filterFoodCarb(foodQueries)
        const fatSource = filterFoodFat(foodQueries)
        const oilSource = filterFoodOil(foodQueries)
        console.log("Protein, Carb, Fat, Oil: ", proteinSource, carbSource, fatSource, oilSource)

        if(curProtein >= macroProtein - 5 
            && curProtein <= macroProtein + 5
            && curTotalKcal >= macroTotalKcal - 100
            && curTotalKcal <= macroTotalKcal + 100) return foodIDs

        //Case when they lack Protein// over Protein
        
        proteinSource = stepOne(proteinSource, gapProtein).sourceArray
        gapKcal = gapKcal + stepOne(proteinSource, gapProtein).caloChangeProtein

        console.log("Gap Kcal after Step 1 is: ", gapKcal)

        foodIDs = updateFoodID(foodIDs, proteinSource)
        //TODO: Update the foodIDs with protein
        if(curProtein >= macroProtein - 5 
            && curProtein <= macroProtein + 5
            && curTotalKcal >= macroTotalKcal - 100
            && curTotalKcal <= macroTotalKcal + 100) return foodIDs

        let gapKcal = curTotalKcal - macroTotalKcal

        //Case when over/not enough Calorie
        fatSource = stepTwo(fatSource, gapKcal)
        foodIDs = updateFoodID(foodIDs, fatSource)

        if(gapKcal >= - 100
            && gapKcal <=  100) return foodIDs

        //Case when needed to change Carb

        resolve(foodIDs)
        reject("")
    })

const updateFoodID = (foodIDs, sourceArray) => {
    for(let i = 0; i < foodIDs.length; i ++) {
        for(let j = 0; j < sourceArray.length; j++ ) {
            const index = _.findIndex(foodIDs, function(o) {
                foodIDs[i].reference === sourceArray[i][j].reference
            })        
            foodIDs[i][index].serving = sourceArray[i][j].serving
        }
    }
    return foodIDs
}

const defaultNutrition = async (foodQueries) => {
        let curProtein = 0
        let curCarb = 0 
        let curFat = 0
        for(let i = 0; i < foodQueries.length; i++) {
            for(let j = 0; j < foodQueries[i].ingreList.length; j++) {
                let ingreQuery = await ingredientModel.findById({_id: foodQueries[i].ingreList[j].reference}, 
                    (err, ingreFound) => {
                    protein = protein + ingreFound.protein
                    carb = carb + ingreFound.carb
                    fat = fat + ingreFound.fat
                })
            }
            }
        const curTotalKcal = 4*(carb + protein) + 9*fat
        return {curTotalKcal, curProtein, curCarb, curFat}
    }


//Fixing Protein Intake
async function stepOne(sourceArray, gapProtein) { //sourceArray [{{ingreId,}, serving, flag}]
    const mostDiff = {index: 0, id: 0, serving: 0}
    //const leastDiff = {index: 0, id: 0, serving: 0}


    for(let i = 0; i < sourceArray.length; i++) {
        _.orderBy(sourceArray[i], function(o) {return (o.protein - o.fat)}, 'asc')
    }

    for(let i = 0; i < sourceArray.length(); i++ ) {
        let ingreQuery = await ingredientModel.findById(sourceArray[i][0].reference)
        if(ingreQuery.protein - ingreQuery.fat > mostDiff.diffProFat) {
                mostDiff.index = i
                mostDiff.id = ingreQuery.reference
        }
       if(ingreQuery.protein - ingreQuery.fat < leastDiff.diffProFat) {
            least.index = i
            leastDiff.id = ingreQuery.reference
        }    
    }

        let ingreProtein = 0
        let caloChangeProtein = 0
        const foodServingIndex = _.findIndex(sourceArray[mostDiff.index], function(o) {
            o._id = mostDiff.id
        })
        let foodServing = sourceArray[mostDiff.index][foodServingIndex].serving

        mostDiff = await ingredientModel.findById(mostDiff.id)
        .then(data => {
            ingreProtein = data.protein
            mostDiff.serving = foodServing  + (gapProtein/ingreProtein)
            caloChangeProtein = (4*(data.carb + data.fat) + 9*data.protein) * gapProtein/ingreProtein 
            return mostDiff
        })
        .catch(err => console.log(err))

        sourceArray[mostDiff.index][foodServingIndex].serving = mostDiff.serving
        console.log("Fixed Protein Source Array",sourceArray)
        return {sourceArray, caloChangeProtein}
}

//Change fat-rich items
async function stepTwo (sourceArray, gapKcal) {
    for(let i = 0; i < sourceArray.length; i ++) {
        _.orderBy(sourceArray, 'fat', 'desc')
    }

        const ingreQuery = await ingredientModel.findById(sourceArray[0].reference)
        let servingChangeFat = Math.floor(gapKcal/(ingreQuery.fat * 9)*10)/10

        sourceArray[0].serving = sourceArray[0].serving + servingChangeFat
        gapKcal = gapKcal - gapKcal/(ingreQuery.fat * 9)

    return {sourceArray, gapKcal} // Has the ID of the fat to be removed and the id of it
}

async function stepThree(sourceArray, gapKcal) {
    for(let i = 0; i < sourceArray.length; i ++) {
        _.orderBy()
    }
}

async function filterFoodProtein(foodArray) {
    foodArray.map(food => food.ingreList.filter(ingre => ingre.flag === '1')); //FoodArray [[flag === 1]]
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