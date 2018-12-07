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

  fToken: {
    type: String
  },

  googleID: {
    type: String
  },

  googleThumbnail: {
    type: String
  },

  facebookID: {
    type: String
  },
  loggedIn: {
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
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", UserSchema, "registered_users");
