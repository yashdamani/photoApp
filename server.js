const express = require("express");
const bodyParser = require("body-parser");
var validator = require("express-validator");
const registerRoute = require("./routes/registerRoute");
const resendEmail = require("./routes/resendEmail");
const verificationEmail = require("./routes/verificationEmail");
const mongoose = require("mongoose");
const mongoLink = require("./config/keys");

var app = express();
var port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());

app.get("/", function(req, res) {
  res.send("<h1>Main Page</h1>");
});

app.use("/register-login", registerRoute);
app.use("/verificationLink", verificationEmail);
app.use("/resendEmail", resendEmail);

mongoose.connect(
  mongoLink.mongoURI,
  { useNewUrlParser: true },
  function(err) {
    if (err) throw err;
    console.log("Database connected!");
  }
);

app.listen(port, function(err) {
  if (err) throw err;
  console.log(`Server running on ${port}!`);
});
