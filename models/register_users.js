var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var UserSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  password: {
    type: String,
    required: true
  },

  token: {
    type: String
  },

  active: {
    type: Boolean
  }
});

UserSchema.pre("save", function(next) {
  var user = this;
  if (!user.isModified("password")) return next();
  if (user.password) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) next(err);
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        if (err) throw err;
        user.password = hash;
        next(err);
      });
    });
  }
});

UserSchema.methods.comparePassword = function(password) {
  if (password == this.password);
};

module.exports = mongoose.model("User", UserSchema, "registered_users");
