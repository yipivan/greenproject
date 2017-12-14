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
        callbackURL: "http://localhost:5000/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
        User.findOrCreate({
          where: { emailOrId: profile.id },
          defaults: { password: "", firstName: profile.displayName }
        })
          .spread((user, created) => {
            created == true? console.log('new user'):console.log('existing user')
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
        passReqToCallback: true,
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
                  if (err) return done (err);
                  newUser.password = hash;
                  newUser.save();
                  return done(null, newUser)
                });
              });
            }
          })
          .catch(err => {
            return done(err);
          });
      }
    )
  );

  //Log-in
  passport.use("local-login",
    new LocalStrategy(
      {
        //setup to use non default form name field
        usernameField: "Email",
        passwordField: "Password"
      },
      function(email, password, done) {
        console.log("I am fucking trying")
        User.findOne({
          where: { emailOrId: email }
        })
          .then(user => {
            // check if user exist
            if (!user) {
              console.log('user not exist')
              return done(null, false, {message: 'user not exist'});
            }
            // check if password match hash
            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (isMatch) {
                console.log('user and pw match')
                return done(null, user);
              } else {
                console.log('user and pw DOES NOT match')
                return done(null, false);
              }
            });
          })
          .catch(err => {
            return done(err)
          });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
    console.log(user)
  });
};

//not yet migrated
