const passport = require('passport')
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy
const User = require('../model/User')
require('dotenv').config();

module.exports = (app)=>{
    app.use(passport.initialize());
    app.use(passport.session());
  
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "http://localhost:8080/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, cb) {
        return cb(null,{profile:profile,accessToken:accessToken});
      }
    ));

    passport.use(new LocalStrategy(
        function(username, password, done) {
          User.findOne({ username: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            if (!user.verifyPassword(password)) { return done(null, false); }
            return done(null, user);
          });
        }
      ));
    
    passport.serializeUser((user,done)=>{
      done(null,user);
    });
  
    passport.deserializeUser((user,done)=>{
      done(null,user);
    });
  }