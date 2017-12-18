const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();
const User = require("../models").user;
<<<<<<< HEAD
const Search_log = require("../models").search_log;
const Usage_log = require("../models").usage_log;
const {isLoggedIn} = require("../helpers/auth");
=======
const SearchLog = require("../models").search_log;
>>>>>>> routing

//user login
router.post("/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

//user register (if register success, user is automatically loggedin)
router.post("/register",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

//loggined user search action (search_log + usage_log)
router.post(":id/search",isLoggedIn, (req, res) => {
  
  // create new search_log for every search.
  // authenticate by user_mailOrId == req.session.passpot.user.id == req.params.id
  User.findOne({
    where: { emailOrId: req.session.passport.user.id }
  }).then(user => {
    if(req.params.id !== user.emailOrId){
      console.log('Not Authorised')
      res.redirect('/login')  
    } else {
      Search_log.create({
        userId: req.session.passport.user.id,
        query: "search_input",
        location_lat: "location_lat",
        location_lng: "location_lng"
      });
    } 
  });

  //create or update recycle_times data whenever confirm recycle
  Usage_log.findOrCreate({
    where: {
      userId: req.session.passport.user.id
    },
    defaults:{
      recycle_item_qty: 0,
      recycle_times: 0
    }
  })
  .then(usage_log => {
    usage_log.increment("recycle_times", { by: 1 });
  });
});

  //retrieve user profile data
router.get("/:id",isLoggedIn,(req,res)=>{
  User.findOne({
    where:{
      emailOrId: req.session.passport.user.id
    }
  }).then(user=>{
    if(req.params.id !== user.emailOrId){
      console.log('Not Authorised')
      res.redirect('/login')  
    } else { 

      //retrieve usage_log
      Usage_log.findOne({
        where:{
          userId: req.session.passport.user.id
        }
      }).then(usage_log=>{
        return usage_log
      })

      //retrieve latest 10 pieces of search_log
      Search_log.findAll({
        where: {
          userId: req.session.passport.user.id
        },
        limit: 10,
        order: [ [ 'createdAt', 'DESC' ]]
      }).then(search_log => {
        return search_log;
      });  
    } 
  }) 
})

//logout 
router.post("/search", (req,res) => {
  console.log(req.body);
  var data = {
    "wasteType": req.body['data[0][value]'],
    "quantity": req.body['data[1][value]'],
    "location": {
      "lat": req.body['origin[lat]'],
      "lng": req.body['origin[lng]']
    }
  }

  var searchLog = new SearchLog();
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



module.exports = router;
