const express = require('express')
const router = express.Router();
const menuController = require('../Controllers/menu')

router.get("/", (req,res) => {
    menuController
    .getAllMenu(req.body) 
    .then(allMenus => res.send(allMenus))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.get("/:id", (req,res) => {
    menuController
    .getOneMenu(req.params.id)
    .then(oneMenu => res.send(oneMenu))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.post("/", (req,res) => {
    menuController
    .addMenu(req.body) 
    .then(createdMenu => res.send(createdMenu))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.put("/:id", (req,res) => {
    menuController
    .updateMenu(req.body)
    .then(updatedMennu => res.send(updatedMennu))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.delete("/", (req, res) => {
    menuController
    .deleteAllMenu(req.body) // need to get UserID
    .then(id => res.send(id))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
}) 

module.exports = router;