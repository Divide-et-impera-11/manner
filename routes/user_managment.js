const express = require("express")
const users = express.Router();
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY = 'secret'


users.post('/register', (req,res) => {
    const today = new Date()
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        created: today
    }

    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(!user){
            const hash = bcrypt.hashSync(userData.password, 10)
            userData.password = hash
            User.create(userData)
            .then(user => {
                    let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                    expiresIn: 1440
                })
                res.json({ token: token })
            })
            .catch(err => {
                console.log("JWT Error")
                console.log(err);
                res.send("error")
            })
        }
        else{
            console.log("Van márt ilyen felhasználó!");
            res.json({error: 'User'})
        }
    })
    .catch(err => {
        console.log("SQL hiba");
        console.log(err);
        res.send("error")
    })
})

users.post('/login' , (req,res) =>{
    console.log("User data:");
    console.log(req.body.email);
    console.log(req.body.password);

    User.findOne({
        where: {
            email: req.body.email
        }
    })
    .then(user => {
        if(user){
         if(bcrypt.compareSync(req.body.password, user.password)){
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
                expiresIn: 1440
            })
            res.json({ token: token})
        }
        else{
            console.log("Node: van ilyen email de a jelszó nem eggyezik")
            return res.status(400).send({
                message: 'Incorrect Password!'
             });
        }
      }
      else{
          console.log("Node: nincs ilyen felhasználó");
          return res.status(400).send({
            message: 'Incorrect Email!'
         });
      }
    })
    .catch(err => {
        res.send(err);
    })
})

users.get('/profile', (req, res) => {
    console.log("profile")
    console.log(req.headers['authorization']);
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

    User.findOne({
        where: {
            id: decoded.id
        }
    })
    .then(user => {
        if(user){
            res.json(user)  
        }
        else {
            res.send('User does not exist')
        }
    })
    .catch(err => {
        console.log("profile hiba");
        res.send("error")
    })
})
module.exports = users