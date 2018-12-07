const express = require("express");
const Router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/register_users");
const secretKey = require("../config/keys");
const path = require("path");

Router.get("/:code", function(req, res) {
  console.log(req.params.code);
  res.sendFile(path.join(__dirname + "/../views/forgotpassword.html"));
}).post("/:code", function(req, res) {
  console.log(req.params.code);
  User.findOne({ fToken: req.params.code }, function(err, user) {
    if (!user) res.send({ Status: "User not found" });
    else {
      console.log(req.params.code);
      jwt.verify(req.params.code, secretKey.jwtSecretKey, function(
        err,
        decoded
      ) {
        if (err) {
          throw err;
        } else {
          user.fToken = "";
          user.password = req.body.password;
          user.save(function(err) {
            if (err) throw err;
            res.send("Password updated successfully");
          });
        }
      });
    }
  });
});

module.exports = Router;
