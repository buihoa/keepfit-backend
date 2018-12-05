const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const AuthRouter = express.Router();

const UserModel = require("../Models/User")

AuthRouter.post("/login", async(req, res) => {
    const {email, password} = req.body;
    try {
        let userFound = await UserModel.findOne({email});
        if(!userFound || !userFound._id){
            res.status(404).json({success: 0, message: "No such user"});
        } else{
            if(!bcrypt.compareSync(password, userFound.hashPassword)){
                res.status(401).json({success: 0, message: "Wrong password"});
            } else {
                req.session.userInfo = {
                    id: userFound._id,
                    name: userFound.name,
                    email: userFound.email
                }
                res.json({success: 1, message: "Login success!"})
            }
        }
    } catch (error) {
        res.status(500).json({success: 0, error});
    }
});

AuthRouter.delete("/logout", (req, res) => {
    req.session.userInfo = undefined;
    req.session.destroy();
    res.json({success: 1, message: "Logout success"})
})

module.exports = AuthRouter;