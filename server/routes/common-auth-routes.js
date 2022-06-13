const router = require("express").Router();
const CLIENT_HOME_PAGE_URL = "http://localhost:3000";

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "user has successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
  } else {
    res.status(401).json({
      success: false,
      message: "user failed to authenticate",
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "user failed to authenticate",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  req.session = null;
  res.redirect(CLIENT_HOME_PAGE_URL);
});

module.exports = router;
