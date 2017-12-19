const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();
const User = require("../models").user;
const Search_log = require("../models").search_log;
const Usage_log = require("../models").usage_log;
const { isLoggedIn } = require("../helpers/auth");

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
router.post("/search", isLoggedIn, (req, res) => {
  /*
  { 'formData[0][name]': 'waste-type',
  'formData[0][value]': 'metal',
  'formData[1][name]': 'quantity',
  'formData[1][value]': '1',
  query: 'Sheung Wan Civic Centre',
  'latlng[]': [ '22.285954', '114.14980800000001' ] }
  */
  data = {
    wastType: req.body['formData[0][value]'],
    quantity: req.body['formData[1][value]'],
    query: req.body.query,
    latlng: [parseFloat(req.body['latlng[]'][0]), parseFloat(req.body['latlng[]'][1])]
  }

  // create new search_log for every search.
  // authenticate by user_mailOrId == req.session.passpot.user.id == req.params.id
  User.findOne({
    where: { emailOrId: req.session.passport.user.emailOrId }
  }).then(user => {
    // if (req.params.id !== user.id) {
    //   console.log('Post /search Not Authorised')
    //   res.redirect('/login')
    // } else {
      Search_log.create({
        userId: user.id,
        query: data.query,
        location_lat: data.latlng[0],
        location_lng: data.latlng[1]
      });
    // }
  })
  .catch(err=> console.log(err));

  //create or update recycle_times data whenever confirm recycle
  Usage_log.findOrCreate({
    where: {
      userId: req.session.passport.user.id
    },
    defaults: {
      recycle_item_qty: 0,
      recycle_times: 0
    }
  })
    .then(() => {
      Usage_log.increment("recycle_times", { by: 1, where: {userId : req.session.passport.user.id} });
    })
    .catch(err => console.log(err));
});

router.get("/logout", (req, res) => {
  req.logout();
  console.log("im logged out");
  res.redirect("/");
});

  //retrieve user profile data
router.get("/:id",isLoggedIn,(req,res)=>{
  const p1 = 
  User.findOne({
    where: {
      emailOrId: req.session.passport.user.emailOrId
    }
  }).then(user => {
    if (req.params.id !== user.id) {
      console.log('get /:id Not Authorised')
      res.redirect('/login')  
    } else { 
      //retrieve usage_log
      Usage_log.findOne({
        where: {
          userId: req.session.passport.user.id
        }
      }).then(usage_log => {
        return usage_log
      })
  //retrieve latest 10 pieces of search_log
  const p2 = 
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
  //res.render(template,{usage_log: value[0], search_log: value[1]})
  Promise.all ([p1,p2]).then(value=>{})
})

module.exports = router;
