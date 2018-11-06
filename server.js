const express = require("express");
const bodyParser = require("body-parser");
var validator = require("express-validator");
var nodeMailer = require("nodemailer");
var jwt = require("jsonwebtoken");
const path = require("path");

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

var transporter = nodeMailer.createTransport({
  host: "gains.arrowsupercloud.com",
  port: 465,
  secure: true,
  auth: {
    user: "_mainaccount@yashdamani.com",
    pass: "9sg1m1DP7v"
  }
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
    var vToken = jwt.sign({ email: req.body.email }, "happy", {
      expiresIn: 30
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
app.get("/resendEmail", (req, res) => {
  res.sendFile(path.join(__dirname + "/emailPage.html"));
});

app.post("/resendEmail", function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) res.send("User not found");
    else {
      const vToken = jwt.sign({ email: req.body.email }, "happy", {
        expiresIn: 30
      });
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

app.get("/verificationLink/:code", function(req, res) {
  User.findOne({ token: req.params.code }, function(err, user) {
    if (!user) res.redirect("/resendEmail");
    else {
      jwt.verify(req.params.code, "happy", function(err, decoded) {
        if (err) {
          user.token = "";
          user.save(function(err) {
            if (err) throw err;
            console.log("token updated");
          });

          res.redirect("/resendEmail");
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

// app.delete("/register-login:id", function(err, users) {
//   User.remove({ emai: req.params.id }, function(err) {
//     if (err) throw err;
//     res.json({ Status: "Delete Successful" });
//   });
// });

// app.put("/register-login:id", function(req, res) {
//   User.findById(req.params.id, function(err, users) {
//     if (err) throw err;

//     user.email = req.body.email;
//     user.password = req.body.f_password;
//     user.confirmed_password = req.body.c_password;

//     user.save(function(err) {
//       if (err) throw err;
//       res.json(users);
//     });
//   });
// });

app.listen(port, function(err) {
  if (err) throw err;
  console.log(`Server running on ${port}!`);
});
