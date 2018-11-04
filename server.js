const express = require("express");
const bodyParser = require("body-parser");
var mongoose = require("mongoose");
var validator = require("express-validator");

var db = require("./models/dbconnect");
var User = require("./models/register_users");

var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

app.get("/", function(req, res) {
  res.send("<h1>Main Page</h1>");
});

app.get("/register-login", function(req, res) {
  res.sendFile(__dirname + "/register_form.html");
});

app.post("/register-login", function(req, res) {
  req
    .checkBody("fullname", "Cannot leave name field empty")
    .isLength({ min: 3, max: 20 });
  req.checkBody("email", "Cannot leave email field empty").isEmail();
  req
    .checkBody("password", "Passwords dont match!")
    .equals(req.body.confirmed_password);
  req
    .checkBody("password", "Minimum length should be 8 characters!")
    .isLength({ min: 8 });

  var errors = req.validationErrors();
  var result = {};
  if (errors) {
    for (i = 0; i < errors.length; i++) {
      result[errors[i].param] = errors[i].msg;
    }
    res.send(result);
  } else {
    var user = new User();
    user.fullname = req.body.fullname;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save(function(err) {
      if (err) throw err;
      res.json({ Status: "Success" });
    });
  }
});

app.delete("/register-login:id", function(err, users) {
  User.remove({ emai: req.params.id }, function(err) {
    if (err) throw err;
    res.json({ Status: "Delete Successful" });
  });
});

app.put("/register-login:id", function(req, res) {
  User.findById(req.params.id, function(err, users) {
    if (err) throw err;

    user.email = req.body.email;
    user.password = req.body.f_password;
    user.confirmed_password = req.body.c_password;

    user.save(function(err) {
      if (err) throw err;
      res.json(users);
    });
  });
});

app.listen(port, function(err) {
  if (err) throw err;
  console.log(`Server running on ${port}!`);
});
