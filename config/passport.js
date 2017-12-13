const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const sequelize = require('sequelize')
const User = require("../models").user;
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
        User.findOrCreate({ where: {emailOrId: profile.id}, defaults:{password:"",firstName: profile.displayName}})
        .spread((user,created) =>{return cb(null, user)})
        .catch((err)=>{return cb(err)})
      }
    )
  );

  passport.use(
    new LocalStrategy(function(username, password, done) {
      User.findOne({ emailOrId: username }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false);
        }
        if (!user.verifyPassword(password)) {
          return done(null, false);
        }
        return done(null, user);
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
