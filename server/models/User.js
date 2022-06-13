const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  googleId: String,
});

// passport-local-mongoose initialize
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

const User = mongoose.model("user", userSchema);

module.exports = User;
