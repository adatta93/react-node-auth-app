const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/User");

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((e) => {
      done(new Error("Failed to deserialize an user"));
    });
});

// passport local strategy initialize
passport.use(User.createStrategy());

// Google OAuth 2.0 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, cb) => {
      User.findOne({ googleId: profile.id }, (err, user) => {
        if (err) {
          console.log("Google error");
          return cb(err);
        }
        if (!user) {
          let newUser = new User({
            email: profile.emails[0].value,
            googleId: profile.id,
          });
          newUser.save((error) => {
            if (error) {
              return cb(error);
            }
            return cb(error, newUser);
          });
        } else {
          return cb(err, user);
        }
      });
    }
  )
);
