const express = require("express");
const bodyParser = require("body-parser");
const validator = require("express-validator");
const registerRoute = require("./routes/registerRoute");
const resendEmail = require("./routes/resendEmail");
const verificationEmail = require("./routes/verificationEmail");
const mongoose = require("mongoose");
const authKeys = require("./config/keys");
const passport = require("passport");
const loginRoute = require("./routes/loginRoute");
const authRoutes = require("./routes/authRoutes");
var dashboardRoute = require("./routes/dashboard");
const logoutRoute = require("./routes/logoutRoute");
const passportSetup = require("./config/passportSetup");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(validator());
// app.use(
//   cookieSession({
//     maxAge: 24 * 60 * 60 * 1000,
//     keys: [authKeys.cookieKey]
//   })
// );
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.get("/", function(req, res) {
  res.send("<h1>Main Page</h1>");
});

app.use("/register-login", registerRoute);
app.use("/verificationLink", verificationEmail);
app.use("/resendEmail", resendEmail);
app.use("/login", loginRoute);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoute);
app.use("/logout", logoutRoute);

mongoose.connect(
  authKeys.mongoURI,
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
