const express = require("express");
const Router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/keys");
const transporter = require("../config/mailTransporter");
const User = require("../models/register_users");

Router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/../views/register_form.html"));
}).post("/", function(req, res) {
  req
    .checkBody("fullname", "Cannot leave name field empty")
    .isLength({ min: 3, max: 50 });
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
    var vToken = jwt.sign({ email: req.body.email }, secretKey.jwtSecretKey, {
      expiresIn: 120
    });
    var user = new User();
    user.fullname = req.body.fullname;
    user.email = req.body.email;
    user.password = req.body.password;
    user.token = vToken;

    user.save(function(err) {
      if (err) throw err;
      res.json({ Status: "Success" });
    });

    var mailOptions = {
      from: '"Yash Damani" <tech@yashdamani.com',
      to: user.email,
      subject: "Verification mail",
      text:
        "This message is from yashdamani.com, checking for verification of registration",
      html: `<p>Hello,</p>
                <p>Please click on the <a href="http://192.168.0.138:3000/verificationLink/${
                  user.token
                }">link</a> to verify the account : </p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log("Message sent 1: %s", info.messageId);
    });
  }
});

module.exports = Router;
