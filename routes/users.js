const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();
const User = require("../models").user;
const Search_log = require("../models").search_log;
const Usage_log = require("../models").usage_log

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

//loggined user search action

router.post("/search", (req, res) => {
  
  // create new search_log for every search.
  User.findOne({
    where: { emailOrId: req.session.passport.user.id }
  }).then(user => {
    Search_log.create({
      userId: req.session.passport.user.id,
      query: "search_input",
      location_lat: "location_lat",
      location_lng: "location_lng"
    });
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

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



module.exports = router;
