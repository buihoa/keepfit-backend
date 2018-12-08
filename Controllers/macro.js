/* const ingredientModel = require('../Models/Ingredient')
const foodModel = require('../Models/Food')
const menuModel = require('../Models/Menu')
const _ = require('lodash')

//Pass down the menu selected from Menu Controller
const adjustMacro = async (foodIDs, {macroTotalKcal, macroProtein, macroCarb, macroFat}) => { 
    new Promise((resolve, reject) => {
        const foodQueries = []
        for(var i = 0; i < foodIDs.length; i ++) {
            await foodModel.findById({_id: foodIDs[i]}, (err, foodFound) => { //foodIDs[]
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

        let gapKcal = curTotalKcal - macroTotalKcal

        //Case when they lack Protein// over Protein
        protein = stepOne(proteinSource, gapProtein).sourceArray
        gapKcal = gapKcal + stepOne(proteinSource, gapProtein).caloChangeProtein

        //Case when over/not enough Calorie


        //Case when needed to change Carb


        resolve()
    })



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
       /*  if(sourceArray[i][0].protein - sourceArray[i][0].fat < leastDiff.diffProFat) {
            least.index = i
            leastDiff.id = sourceArray[i][0]._id
        }    */
    /*}

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
        return {sourceArray, caloChangeProtein}
}

//Change fat-rich items
async function stepTwo (foodQueries, sourceArray, gapKcal) {

    let count = 0
    _.flatten(sourceArray)
    let i = 0
    let result = []

    if(gapKcal > 0) {
    while(count < gapKcal) {
        _.orderBy(sourceArray, "fat", 'desc')
        count = count + 9*sourceArray[i]
            result.push({idFat: sourceArray[i].ingredientID, serving: sourceArray[i].serving}])
        console.log("Here is the fat selected", result)
        i++
        }
        gapKcal = gapKcal - count
    }

    if(gapKcal < 0) {
        while(count < (-gapKcal)) {
            _.orderBy(sourceArray, "fat", 'desc')
            count = count + 9*sourceArray[i].fat
                result.push({idFat: sourceArray[i].ingredientID, serving: sourceArray[i].serving})
            console.log("Here is the fat selected", result)
            i++
            }
            gapKcal = gapKcal + count
    }
    result.push(count) // the calorie reduced //gained

    for(var i = 0 ; i < (result.length -1); i++) {
        foodQueries.map(food => _.flatten(food).filter(ingre => ingreID !== result[i].idFat
            && serving !== result[i].serving))
    }
    

    return {foodQueries, gapKcal} // Has the ID of the fat to be removed and the id of it
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
} */