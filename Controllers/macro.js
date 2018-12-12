const ingredientModel = require('../Models/Ingredient')
const foodModel = require('../Models/Food')
const _ = require('lodash')
const ingredientController = require('./ingredients')
const foodController = require('./food')
//Pass down the menu selected from Menu Controller
const adjustMacro = (foodIDs, {
    macroTotalKcal,
    macroProtein
}) => new Promise(async (resolve, reject) => {
    try {
        let foodQueries = await getFoodQueries(foodIDs)
        console.log("Food Queries is: ", foodQueries[0].ingreList[0])
        console.log("Food Queries is: ", foodQueries[0].ingreList[0].reference)

        const {
            curTotalKcal,
            curProtein,
            curCarb,
            curFat
        } = await defaultNutrition(foodQueries)

        const gapProtein = curProtein - macroProtein
        let gapKcal = curTotalKcal - macroTotalKcal

        let proteinSource = await filterFoodProtein(foodQueries.slice())
        let carbSource = await filterFoodCarb(foodQueries.slice())
        let fatSource = await filterFoodFat(foodQueries.slice())
        let oilSource = await filterFoodOil(foodQueries.slice())

 

        proteinSource = removeEle(proteinSource)
        carbSource = removeEle(carbSource)
        fatsource = removeEle(fatSource)
        oilSource = removeEle(oilSource)

        console.log("Protein", proteinSource)
        console.log("Protein", carbSource)
        console.log("Protein", fatSource)
        console.log("Protein", oilSource)

        if (curProtein >= macroProtein - 5 &&
            curProtein <= macroProtein + 5 &&
            curTotalKcal >= macroTotalKcal - 100 &&
            curTotalKcal <= macroTotalKcal + 100) return foodQueries

        const stepOneVar = await stepOne(foodQueries, proteinSource, gapProtein, gapKcal)
        foodQueries = stepOneVar.foodQueries
        gapKcal = stepOneVar.gapKcal



        console.log("After step 1 FoodIDs: ", foodQueries, gapKcal)
        if (curTotalKcal >= macroTotalKcal - 100 &&
            curTotalKcal <= macroTotalKcal + 100) return foodIDs

        const stepTwoVar = await stepTwo(foodIDs, fatSource, gapProtein, gapKcal)
        const stepThreeVar = await stepTwo(foodIDs, fatSource, gapProtein, gapKcal)

        resolve(foodQueries)
    } catch (e) {
        reject(e)
    }
})

const updateCalo = (gapKcal, caloChange) => new Promise((resolve, reject) => {
    if (gapKcal < 0) {
        gapKcal = gapKcal + caloChange
    } else gapKcal = gapKcal - caloChange
    return gapKcal
})

const getFoodQueries = (foodIDs) => new Promise(async (resolve, reject) => {
    let foodQueries = []
    try {
        for (let i = 0; i < foodIDs.length; i++) {
            let temp = await foodModel.findById(foodIDs[i])
            .populate({
                path: 'ingreList.reference',
                model: 'ingredient'
            })
            .lean();
            console.log("Temp is ", temp)
            if (!temp) reject("Invalid FoodID")
            else {
                foodQueries.push(temp) // FoodQueries[foodItem from food Models]
            }
        }
        resolve(foodQueries)
    } catch (e) {
        reject(e)
    }
})


const updateFoodID = (foodQueries, sourceArray) => new Promise((resolve, reject) => {
    for (let i = 0; i < foodQueries.length; i++) {
        for (let j = 0; j < sourceArray.length; j++) {
            const index = _.findIndex(foodQueries[i].ingreList, function (o) {
                return o.reference._id === sourceArray[j].reference._id &&
                    o.reference.flag === sourceArray[j].reference.flag
            })
            if (index != -1) {
                foodQueries[i].ingreList[index] = sourceArray[j]
                break
            }
        }
    }
    resolve(foodQueries)
})

const removeEle = (doubleArray) => {
    for (let i = 0; i < doubleArray.length; i++) {
        if (doubleArray[i].length == 0) {
            doubleArray.splice(i, 1)
        }
    }
    return doubleArray
}

const defaultNutrition = (foodQueries) => new Promise((resolve, reject) => {
    let curProtein = 0
    let curCarb = 0
    let curFat = 0
    let curTotalKcal = 0
    for (let i = 0; i < foodQueries.length; i++) {
        curProtein = curProtein + foodQueries[i].protein
        curCarb = curCarb + foodQueries[i].carb
        curFat = curFat + foodQueries[i].fat
        curTotalKcal = curTotalKcal + foodQueries[i].totalKcal
    }
    resolve({
        curTotalKcal,
        curProtein,
        curCarb,
        curFat
    }) 
})

//Fixing Protein Intake to fit the protein
const stepOne = (foodQueries, sourceArray, gapProtein, gapKcal) => new Promise((resolve, reject) => {
    sourceArray = _.flattenDeep(sourceArray)


    // for(let i =0 ; i < sourceArray.length; i++) {
    //     sourceArray[i].reference = ingredientController.viewOneIngredient(sourceArray[i].referece)
    //     console.log("After change:", sourceArray)
    // }

    // console.log("Array in Change: ", sourceArray)

    console.log("STEP ONE ARRAY: ", sourceArray[0])

    _.orderBy(sourceArray, function (o) {
        return (o.reference.protein - o.reference.fat)
    }, 'desc')

    console.log("Source Array after orderBY: ", sourceArray)

    const mostDiff = {
        index: 0,
        id: 0,
        serving: 0,
        diff: 0
    }

    const servingChange = gapProtein / sourceArray[0].reference.protein
    const caloPerUnit = 9 * sourceArray[0].reference.fat +
        4 * (sourceArray[0].reference.protein + sourceArray[0].reference.carb)
    const caloChangeProtein = servingChange * caloPerUnit

    foodQueries = updateFoodID(foodQueries, sourceArray[0])
    gapKcal = updateCalo(gapKcal, caloChangeProtein)

    resolve({
        foodQueries,
        gapKcal
    })
})
// for (let i = 0; i < sourceArray.length; i++) {
//     for (let j = 0; j < sourceArray[i]; j++) {
//         sourceArray[i][j].reference = ingredientController.viewOneIngredient(sourceArray[i][j].reference)
//     }
// }


//Change fat-rich items, take out the fattest ingredients
const stepTwo = (foodQueries, sourceArray, gapKcal) => new Promise((resolve, reject) => {
    sourceArray = _.flattenDeep(sourceArray)
    _.orderBy(sourceArray, 'reference.fat', 'desc')
    console.log("Fat Array after orderby: ", sourceArray)
    const servingChangeFat = Math.floor(gapKcal / (sourceArray[0].reference.fat * 9) * 10) / 10

    const caloChange = servingChangeFat *
        (4 * (sourceArray[0].reference.protein + sourceArray[0].referece.carb +
            sourceArray[0].reference.fat * 9))

    console.log("before changing fat Source is: ", sourceArray[0])
    sourceArray[0].serving = sourceArray[0].serving + servingChangeFat
    console.log("after changing fat Source is: ", sourceArray[0])

    updateFoodID(foodQueries, sourceArray[0])
    gapKcal = updateCalo(gapKcal, caloChange)

    return {
        foodQueries,
        gapKcal
    } // Has the ID of the fat to be removed and the id of it
})

const stepThree = (sourceArray, gapKcal) => new Promise((resolve, reject) => {
    for (let i = 0; i < sourceArray.length; i++) {
        for (let j = 0; j < sourceArray[i]; j++) {
            sourceArray[i][j].reference = ingredientController.viewOneIngredient(sourceArray[i][j].reference)
        }
    }
    _.flatMap(sourceArray)
    _.orderBy(sourceArray, 'reference.carb', 'desc')


    const serveChangeCarb = Math.floor(gapKcal / 4 / sourceArray[0].serving / sourceArray[0].reference.carb * 10) / 10

    const caloChange = servingChangeFat *
        (4 * (sourceArray[0].reference.protein + sourceArray[0].referece.carb +
            sourceArray[0].reference.fat * 9))

    updateFoodID(foodIDs, sourceArray[0])
    gapKcal = updateCalo(gapKcal, caloChange)

    return {
        foodIDs,
        gapKcal
    }
})

function filterFoodProtein(foodArray) {
    return foodArray.map(food => food.ingreList.filter(ingre => ingre.flag === 1))
}

function filterFoodCarb(foodArray) {
    return foodArray.map(food => food.ingreList.filter(ingre => ingre.flag === 2))
}

function filterFoodFat(foodArray) {
    return foodArray.map(food => food.ingreList.filter(ingre => ingre.flag === 3))
}

function filterFoodOil(foodArray) {
    return foodArray.map(food => food.ingreList.filter(ingre => ingre.flag === 4))
}

module.exports = {
    adjustMacro
}