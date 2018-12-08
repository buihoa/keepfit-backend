const express = require("express");
const router = express.Router();

const foodController = require('../Controllers/food')

router.get("/", (req, res) => {
    foodController
    .getAllFood(req.query.page || 1) 
    .then(images => res.send(images))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.get("/:id", (req, res) => {
    foodController
    .getFoodbyID(req.params.id)
    .then(id => res.send(id))
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
});

/* router.get("/:ingredient", (req, res) => {
    foodController
    .getFoodbyIngre(req.params.ingredient)
    .then(id => res.send(id))
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
});

router.get("/:nutrition", (req, res) => {
    foodController
    .getFoodbyNutrition(req.params.nutrition)
    .then(id => res.send(id))
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
});
 */
router.post("/", (req, res) => {
    foodController
    .addFood(req.body)
    .then(id => res.send(id))
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
})

router.put("/:id",(req, res) => {
    var foodID = req.params.id;

    foodController
    .updateFood(foodID, req.body)
    .then(id => res(id))
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
})

router.delete("/:id", (req, res) => {
    foodController
    .deleteFood(req.params.id)
    .then(id => res.send(id))
    .catch(err => {
        console.error(err);
        res.status(500).send(err);
    })
})

module.exports = router;