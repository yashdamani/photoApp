const express = require("express");
const Router = express.Router();
const User = require("../models/register_users");

Router.get("/", function(req, res) {
  User.findOneAndUpdate(
    { email: req.cookies.email },
    { $set: { loggedIn: false } },
    function(err, user) {
      res.clearCookie("email");
      if (err) res.redirect("/dashboard");
      else {
        res.redirect("/");
      }
    }
  );
});

module.exports = Router;
