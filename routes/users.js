const express = require("express");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();
const User = require("../models").user;

router.post("/login",
  passport.authenticate("local", { failureRedirect: "" }),
  (req, res) => {
    res.render(login, {
      message: "Welcome Back, You have sucessfully logged in"
    });
  }
);

router.post("/register", (req, res) => {
  User.findOne({
    where: { emailOrId: req.body.Email }
  })
    .then(user => {
      if (!user) {
        const newUser = new User({
          emailOrId: req.body.Email,
          password: req.body.Password,
          firstName: req.body.Firstname
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save();
          });
        });
        res.render("login", { message: "You are now logged in" });
      } else {
        res.render("login", { message: "This e-mail is already registered" });
      }
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
