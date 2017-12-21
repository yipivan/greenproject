const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const sequelize = require("sequelize");
const User = require("../models").user;
const bcrypt = require("bcryptjs");

require("dotenv").config();

module.exports = passport => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "https://www.greenlifehk.com/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({
          where: { emailOrId: profile.id },
          defaults: { password: "", firstName: profile.displayName }
        })
          .spread((user, created) => {
            created == true
              ? console.log("new user")
              : console.log("existing user");
            return cb(null, user);
          })
          .catch(err => {
            return cb(err);
          });
      }
    )
  );

  // Signup
  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        //setup to use non default form name field
        usernameField: "Email",
        passwordField: "Password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        User.findOne({
          where: { emailOrId: email }
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
                  if (err) return done(err);
                  newUser.password = hash;
                  newUser
                    .save()
                    .then(newUser=>{done(null,newUser)})
                });
              });
            } else {
              done(null , false, req.flash("register_error", "This e-mail is already registered"))
            }
          })
          .catch(err => {
            return done(err);
          });
      }
    )
  );

  //Log-in
  passport.use(
    "local-login",
    new LocalStrategy(
      {
        //setup to use non default form name field
        usernameField: "UserEmail",
        passwordField: "UserPassword",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        User.findOne({
          where: { emailOrId: email }
        })
          .then(user => {
            // check if user exist
            if (!user) {
              return done(null, false, req.flash("login_error","User does not exists"));
            }
            // check if password match hash
            bcrypt.compare(password, user.password, (err, isMatch) => {
              console.log(`input password${password}`);
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash) => {
                  console.log(`hashedInputpw${hash}`);
                });
              });
              console.log(`databasepw ${user.password}`);
              if (isMatch) {
                console.log("user and pw match");
                return done(null, user);
              } else {
                return done(null, false, req.flash("login_error","Either Email or Password Does Not Match"))
              }
            });
          })
          .catch(err => {
            return done(err);
          });
      }
    )
  );
  //change to convention setup user -> user.id -> user
  passport.serializeUser((user, done) => {
    // console.log("serializing user");
    // console.log(`user's id: ${user}`);
    // console.log(user)
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log("deserializing user");
    User.findById(id).then(user => {
      if (user) {
        done(null, user.get());
      } else {
        done(user.errors, null);
      }
    });
  });
};
