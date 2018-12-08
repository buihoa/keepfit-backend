const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const router = express.Router();

const userController = require('../Controllers/user')

router.get("/", (req, res) => {
    userController
    .getAllUsers(req.query.page || 1)
    .then(users => res.send(users))
    .catch(err => {
      console.error(err);
      res.status(500).send(err);
    });
});

router.get("/:id", (req, res) => {
    userController
    .getOneUser(req.params.id)
    .then(data => res(data))
    .catch(err => {
        console.error(err)
        res.status(500).send(err)
    });
});

router.post("/", (req, res) => {

    userController
    .addUser(req.body)
    .then(id => res(id))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.put("/:id", (req, res) => {
    userController
    .updateUser(req.params.id, req.body)
    .then(id => res.send(id))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

router.delete("/:id", async(req, res) => {
    const userId = req.params.id;
    userController
    .deleteUser(req.param.id)
    .then(id => res.send(id))
    .catch(err => {
        console.log(err)
        res.status(500).send(err)
    })
})

module.exports = router;