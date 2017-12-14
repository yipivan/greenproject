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
            //console.log(user)
            return cb(null, user);
          })
          .catch(err => {
            return cb(err);
          });
      }
    )
  );

  passport.use(
    new LocalStrategy(function(email, password, done) {
      User.findOne({
        where: { emailOrId: email }
      })
        .then(user => {
          // check if user exist
          if (!user) {
            return done(null, false);
          }
          // check if password match hash
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          });
        })
        .catch(err => {
          throw err;
        });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });
};

//not yet migrated
