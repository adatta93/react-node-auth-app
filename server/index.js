require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const session = require("express-session");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const passportSetup = require("./passport-setup");

const localAuthRoutes = require("./routes/local-auth-routes");
const googleAuthRoutes = require("./routes/google-auth-routes");
const commonAuthRoutes = require("./routes/common-auth-routes");

const saltRounds = 10;

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_KEY],
    maxAge: 24 * 60 * 60 * 100,
  })
);
app.use(
  session({
    secret: "Auth app with react",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser("Auth app with react"));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Connect mongo
mongoose.connect(
  process.env.MONGODB_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log("DB Connection Error ", err);
    }
    console.log("DB Connected");
  }
);

// Default API route
app.get("/", (req, res) => {
  res.send("API Home Page");
});

// set up routes
app.use("/auth", localAuthRoutes);
app.use("/auth", googleAuthRoutes);
app.use("/auth", commonAuthRoutes);

/* Password Login */
app.post("/api/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email: email }, (err, user) => {
    if (err) {
      res.status(401).json({
        success: false,
        message: "user failed to authenticate",
      });
    } else {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            req.session.user = user;
            res.status(200).json({
              success: true,
              message: "user has successfully authenticate",
              user: user,
              cookies: req.cookies,
            });
          } else {
            res.status(401).json({
              success: false,
              message: "user failed to authenticate",
            });
          }
        });
      } else {
        res.status(401).json({
          success: false,
          message: "user failed to authenticate",
        });
      }
    }
  });
});

app.post("/api/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    const user = new User({ email: email, password: hash });
    user.save((err) => {
      if (err) {
        res.status(401).json({
          success: false,
          message: "user failed to authenticate",
        });
      } else {
        req.session.user = user;
        res.status(200).json({
          success: true,
          message: "user has successfully authenticate",
          user: user,
          cookies: req.cookies,
        });
      }
    });
  });
});

app.listen(process.env.PORT, () =>
  console.log("server running at " + process.env.PORT)
);
