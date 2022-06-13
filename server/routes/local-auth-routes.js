const router = require("express").Router();
const passport = require("passport");
const User = require("../models/User");
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

// Local login
router.post(
  "/local/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login/failed",
  }),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
    });
  }
);

//Local register
router.post("/local/register", (req, res) => {
  User.register(
    new User({ email: req.body.email }),
    req.body.password,
    (err, user) => {
      if (err) {
        if (err.name === "UserExistsError") {
          res.status(401).json({
            success: false,
            message: err.message,
          });
        } else {
          res.status(401).json({
            success: false,
            message: "user failed to register",
          });
        }
      } else {
        passport.authenticate("local")(req, res, () => {
          res.status(200).json({
            success: true,
            message: "user has successfully authenticated",
            user: user,
          });
        });
      }
    }
  );
});

//Login with custom callback--not being used---for test
router.post("/local/login1", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "no user found",
      });
    }
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.status(200).json({
        success: true,
        message: "user has successfully authenticated",
        user: req.user,
      });
    });
  })(req, res, next);
});

module.exports = router;
