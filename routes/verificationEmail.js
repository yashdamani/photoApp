const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/register_users");
const secretKey = require("../config/keys");

Router.get("/:code", function(req, res) {
  User.findOne({ token: req.params.code }, function(err, user) {
    if (!user) res.send({ Status: "User not found" });
    else {
      jwt.verify(req.params.code, secretKey.jwtSecretKey, function(
        err,
        decoded
      ) {
        if (err) {
          user.token = "";
          user.save(function(err) {
            if (err) throw err;
            res.send({ Status: "Token updated to null" });
          });
        } else {
          user.token = "";
          user.active = true;
          user.save(function(err) {
            if (err) throw err;
            console.log("Success");
          });
          res.send(`<h1>${user.fullname}'s account verified!</h1>`);
        }
      });
    }
  });
});

module.exports = Router;
