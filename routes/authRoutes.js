const express = require("express");
const Router = express.Router();
const passport = require("passport");

Router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile"]
  })
);

Router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  res.send("<h1>Success! You have logged in via Google.</h1>");
});

Router.get("/facebook", passport.authenticate("facebook"));

Router.get(
  "/facebook/redirect",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    res.send("<h1>Success! You have logged in via Facebook.</h1>");
  }
);
module.exports = Router;
