const express = require("express");
const Router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/keys");
var transporter = require("../config/mailTransporter");
const User = require("../models/register_users");

Router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/../views/emailPage.html"));
}).post("/", function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) res.send("User not found");
    else {
      const vToken = jwt.sign(
        { email: req.body.email },
        secretKey.jwtSecretKey,
        {
          expiresIn: 30
        }
      );
      user.token = vToken;
      user.save(function(err) {
        if (err) throw err;
        console.log("token updated");
      });
      const mailOptions = {
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
        console.log("Message sent 2: %s", info.messageId);
      });
    }
  });
});

module.exports = Router;
