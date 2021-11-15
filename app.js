require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");

var app = express();

//DataBase Connection//
mongoose
  .connect(process.env.DB_API, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DataBase");
  })
  .catch((error) => {
    console.log(error);
    console.log("Connection Failed!!!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(passport.initialize());

var opts = {};
opts.jwtFromRequest = function (req) {
  // tell passport to read JWT from cookies
  var token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};
opts.secretOrKey = process.env.JWT_KEY;

// main authentication, our app will rely on it
passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    console.log("JWT BASED AUTH GETTING CALLED"); // called everytime a protected URL is being served
    if (CheckUser(jwt_payload.data)) {
      return done(null, jwt_payload.data);
    } else {
      // user account doesnt exists in the DATA
      return done(null, false);
    }
  })
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/whrrl",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(accessToken, refreshToken, profile);
      console.log("GOOGLE BASED OAUTH VALIDATION GETTING CALLED");
      return done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "http://localhost:3000",
      profileFields: ["id", "displayName", "email", "picture"],
    },
    function (accessToken, refreshToken, profile, done) {
      console.log(profile);
      console.log("FACEBOOK BASED OAUTH VALIDATION GETTING CALLED");
      return done(null, profile);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// For CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);

app.get('/download/:aadhaar', function(req, res){
  // const file = `${__dirname}/public/data/uploads/${req.params.aadhaar}`;
  const file = `public/data/uploads/${req.params.aadhaar}`;
  res.download(file);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
