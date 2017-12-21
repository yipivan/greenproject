const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();
const User = require("../models").user;
const Search_log = require("../models").search_log;
const Usage_log = require("../models").usage_log;
const { isLoggedIn } = require("../helpers/auth");
const dateformat = require('helper-dateformat');

//user login
router.post("/login",
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

//user register (if register success, user is automatically loggedin)
router.post("/register",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/login#pageid",
    failureFlash: true
  }),
);

//loggined user search action (search_log + usage_log)
router.post("/search", isLoggedIn, (req, res) => {
  /*
  { 'wasteTypes[]': [ 'Metals', 'Paper' ],
  query: '155 Hollywood Road (opposite to Man Mo Miu)',
  'latlng[]': [ '22.284153', '114.15022999999997' ] }
  */
  data = {
    wasteTypes: req.body['wasteTypes[]'],
    query: req.body.query,
    latlng: [parseFloat(req.body['latlng[]'][0]), parseFloat(req.body['latlng[]'][1])]
  }

  // create new search_log for every search.
  // authenticate by user_mailOrId == req.session.passpot.user.id == req.params.id
  let promises = [];
  promises.push(
    User.findOne({
      where: { emailOrId: req.user.emailOrId }
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
    }))
  //create or update recycle_times data whenever confirm recycle
  wasteTypes = data.wasteTypes;
  for (wasteType of wasteTypes) {
    promises.push(Usage_log.findOrCreate({
      where: {
        userId: req.user.id,
        recycle_item_name: wasteType
      },
      defaults: {
        recycle_item_name: wasteType,
        recycle_times: 0
      }
    }).then(usage => {
      usage[0]["recycle_times"] += 1;
      usage[0].save();
    })
      // .then(() => {
      //   Usage_log.increment("recycle_times", { by: 1, where: { userId: req.user.id, recycle_item_name: wasteType } });
      // })
      .catch(err => {
        console.log(err)
      }))
  }

  Promise.all(promises).then(() => {
    res.sendStatus(200);
  }).catch(err => {
    console.log(err);
  });
});

//Logout is placed here to prevent program misread as /:id
router.get("/logout", (req, res) => {
  req.logout();
  console.log("im logged out");
  res.redirect("/");
});

//retrieve user profile data
router.get("/profile", isLoggedIn, (req, res) => {
  const p1 =
    User.findOne({
      where: {
        emailOrId: req.user.emailOrId
      }
    })
      .then(user => {
        if (req.user.id !== user.id) {
          req.flash('error','Access Not Authorised')
          res.redirect('/login')
        } else {
          //retrieve usage_log
          return Usage_log.findAll({
            where: {
              userId: user.id
            }
          })
          //retrieve latest 10 pieces of search_log
        }
      })
  const p2 =
    Search_log.findAll({
      where: {
        userId: req.user.id
      },
      limit: 10,
      order: [['createdAt', 'DESC']]
    })
  //res.render(template,{usage_log: value[0], search_log: value[1]})
  Promise.all([p1, p2]).then(values => {
    console.log(values.length);
    res.render('users/profile', {
      usageLogs: values[0],
      searchLogs: values[1],
      user: req.user,
      helpers: {
        dateformat: dateformat
      }
    });
  })
})

module.exports = router;
