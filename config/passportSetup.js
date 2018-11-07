const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const FacebookStrategy = require("passport-facebook");
const authKeys = require("./keys");
const User = require("../models/register_users");

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      callbackURL: "http://localhost:3000/auth/google/redirect",
      clientID: authKeys.googleClientID,
      clientSecret: authKeys.googleClientSecret
    },
    (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      User.findOne({ fullname: profile.displayName }).then(user => {
        if (!user) {
          res.send("User not found");
          done(null, user);
        } else {
          user.googleID = profile.id;
          user.googleThumbnail = profile._json.image.url;
          user.save(function(err) {
            if (err) throw err;
          });
          done(null, user);
        }
      });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      callbackURL: "http://localhost:3000/auth/facebook/redirect",
      clientID: authKeys.facebookClientID,
      clientSecret: authKeys.facebookClientSecret,
    },

    function(accessToken, refreshToken, profile, cb) {
      console.log(profile);
      User.findOne({ fullname: profile.displayName }, function(err, user) {
        if (!user) {
          cb(err, user);
        } else {
          user.facebookId = profile.id;
          user.save(function(err) {
            if (err) throw err;
          });
          cb(null, user);
        }
      });
    }
  )
);
