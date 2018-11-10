const express = require("express");
const Router = express.Router();
const path = require("path");
const User = require("../models/register_users");

Router.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/../views/dashboard.html"));
});

module.exports = Router;
