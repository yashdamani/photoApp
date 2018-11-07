const LocalStrategy = require("passport-local").Strategy;
const passport = require("passport");
const User = require("../models/register_users");
const express = require("express");
const path = require("path");
const Router = express.Router();
const secretKey = require("../config/keys");

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  "local-login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true
    },
    function(req, email, password, done) {
      User.findOne({ email: email }, function(err, user) {
        if (err) return done(err);
        if (!user) {
          return done(null, false);
        }
        if (!user.comparePassword(password)) {
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

Router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/../views/register_form.html"));
}).post(
  "/",
  passport.authenticate("local-login", {
    failureRedirect: "/login"
  }),
  function(req, res) {
    res.redirect("/");
  }
);

module.exports = Router;
