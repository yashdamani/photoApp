const express = require("express");
const Router = express.Router();
const path = require("path");
const jwt = require("jsonwebtoken");
const secretKey = require("../config/keys");
const transporter = require("../config/mailTransporter");
const User = require("../models/register_users");

Router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/../views/forgotpass.html"));
}).post("/", function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) res.send("User nott found");
    else {
      const vToken = jwt.sign(
        { email: req.body.email },
        secretKey.jwtSecretKey,
        {
          expiresIn: 1000
        }
      );
      user.fToken = vToken;
      user.save(function(err) {
        if (err) throw err;
        console.log(user.fToken);
      });
      const mailOptions = {
        from: '"Yash Damani" <tech@yashdamani.com',
        to: user.email,
        subject: "Password reset mail",
        text:
          "This message is from yashdamani.com, requesting to reset your password.",
        html: `<p>Hello,</p>
                    <p>Please click on the <a href="http://192.168.0.138:3000/fpasswordLink/${
                      user.fToken
                    }">link</a> to reset your password. </p>`
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        console.log("Message sent 3: %s", info.messageId);
      });
    }
  });
});

module.exports = Router;
