const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();
const User = require("../models").user;

router.get('/login', (req, res) => {
});


router.post('/login', (req, res, next)=> {

});

router.post("/register", (req, res) => {
  User.findOne({
    where: {emailOrId: req.body.Email}
  }).then((user)=>{
      if(!user){
          User.create({
            emailOrId: req.body.Email,
            password: req.body.Password,
            firstName: req.body.Firstname
          })
          // register sucessful
      } else { 
        res.render('login',{msg: "This e-mail is already registered"})        // 
      } 
  })
  
  ;
});


router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/')
});

module.exports = router;