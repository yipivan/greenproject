const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();
const User = require("../models").user;
const SearchLog = require("../models").search_log;

router.post(
  "/login", 
  // (req, res) => {
  //   console.log(req.body.UserEmail);
  // }
  passport.authenticate("local-login", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

router.post(
  "/register",
  passport.authenticate("local-signup", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

//   User.findOne({
//     where: { emailOrId: req.body.Email }
//   })
//     .then(user => {
//       if (!user) {
//         const newUser = new User({
//           emailOrId: req.body.Email,
//           password: req.body.Password,
//           firstName: req.body.Firstname
//         });
//         bc/pt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, (err, hash) => {
//             if (err) throw err;
//             newUser.password = hash;
//             newUser.save();
//           });
//         });
//         // Should add log-in function
//         console.log(user)
//         res.redirect('/')
//         //res.render("login", { message: "You are now logged in" });
//       } else {
//         res.render("login", { message: "This e-mail is already registered" });
//       }
//     })
//     .catch(err => {
//       res.send(err);
//     });
// });

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
