const express = require("express");
const router = express.Router();

const ingredientController = require('../controllers/ingredients')

router.use((req, res, next) => {
    next();
});

router.get("/", (req, res) => {
    ingredientController
    .viewAllIngredients()
    .then(ingredients => res.send(ingredients))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
});

router.get("/:id", async(req, res) => {
    var ingredientId = req.params.id;
    ingredientController
    .viewOneIngredient(ingredientId)
    .then(newID => res.send(newID))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
});

//TODO: Need to get some by Name and some by Kcal

router.post("/", (req, res) => {
    ingredientController
    .addIngredient(res.body)
    .then(newID => res.send(newID))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.put("/:id", (req, res) => {
    ingredientController
    .updateIngredient(req.params.id, req.body)
    .then(id => res.send(did))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.delete("/:id", async(req, res) => {
    const ingredientID = req.params.id;

    ingredientController
    .deleteIngredient(ingredientID)
    .then(id => res.send(id))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

module.exports = router;