const emailAuthKeys = require("./keys");
const nodeMailer = require("nodemailer");
var transporter = nodeMailer.createTransport({
  host: emailAuthKeys.host,
  port: emailAuthKeys.port,
  secure: true,
  auth: {
    user: emailAuthKeys.user,
    pass: emailAuthKeys.pass
  }
});
module.exports = transporter;
