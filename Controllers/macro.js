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

        if(curProtein >= macroProtein - 5 
            && curProtein <= macroProtein + 5
            && curTotalKcal >= macroTotalKcal - 100
            && curTotalKcal <= macroTotalKcal + 100) return foodIDs

        let gapKcal = curTotalKcal - macroTotalKcal

        //Case when over/not enough Calorie

        //Case when needed to change Carb


        resolve()
    })

    adjustMacro()


const defaultNutrition = async (foodQueries) => {
        var curProtein = 0
        var curCarb = 0 
        var curFat = 0
        for(var i = 0; i < foodQueries.length; i++) {
            for(var j = 0; j < foodQueries[i].ingreList.length; j++) {
                let ingreQuery = await ingredientModel.findById({_id: foodQueries[i].ingreList[j].ingredientID}, 
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
async function stepOne(sourceArray, gapProtein) { //sourceArray [{ingreId, serving, flag}]
    const mostDiff = {index: 0, id: 0, serving: 0}
    //const leastDiff = {index: 0, id: 0, serving: 0}

    for(var i = 0; i < sourceArray.length; i++) {
        _.orderBy(sourceArray[i], function(o) {return (o.protein - o.fat)}, 'asc')
    }

    for(var i = 0; i < sourceArray.length(); i++ ) {
        if(sourceArray[i][0].protein - sourceArray[i][0].fat > mostDiff.diffProFat) {
                mostDiff.index = i
                mostDiff.id = sourceArray[i][0]._id
        }
       if(sourceArray[i][0].protein - sourceArray[i][0].fat < leastDiff.diffProFat) {
            least.index = i
            leastDiff.id = sourceArray[i][0]._id
        }    
    }

        let ingreProtein = 0
        let caloChange = 0
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
    for(var i = 0; i < sourceArray.length; i ++) {
        _.orderBy(sourceArray, 'fat', 'asc')
    }

    if(gapKcal < 0 ) {
        
    }

    if(gapKcal > 0) {

    }

    return {sourceArray, gapKcal} // Has the ID of the fat to be removed and the id of it
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