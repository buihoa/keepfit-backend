const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

mongoose.connect("mongodb://minhco12:whysoserious1@ds056559.mlab.com:56559/keep-fit-techkids", { useCreateIndex: true, useNewUrlParser: true }, (err) => {
    if(err){
        console.log(err);
    } else{
        console.log("Connected to keep-fit");
    }
});

const userRouter = require("./Routers/UserRouter");
const ingredientRouter = require("./Routers/IngredientRouter");
const foodRouter = require("./Routers/FoodRouter");
const authRouter = require("./Routers/AuthRouter");
const menuRouter = require("./Routers/MenuRouter");

const app = express();
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.use((req, res, next) => {
    res.setHeader("X-Frame-Options", "ALLOWALL");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, OPTIONS"
    );
  
    if (req.headers.origin) {
      res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    }
  
    res.setHeader("Access-Control-Allow-Credentials", true);
  
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });


app.use(session({
    secret: "lskjdfvnljhberybouiybdfs;vjnweirtunipertg",
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure: false,
        httpOnly: false,
        maxAge: 7*24*60*60*1000
    }
}))

app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/api/ingredient", ingredientRouter);
app.use("/api/auth", authRouter);
app.use("/api/menu", menuRouter);

app.get("/api", (req, res) => {
    req.session.username = "dongonson"
    console.log(req.session);
    console.log(req.sessionID);
    res.send("LOL")
})

app.get("/", (req, res) => {
    res.sendFile("./public/index.html");
})

const port = 8888;
app.listen(port, (err) => {
    if(err){
        console.log(err);
    } else{
        console.log("Server is listening at port " + port);
    }
})