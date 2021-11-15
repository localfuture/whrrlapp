var express = require("express");
var passport = require("passport");
var router = express.Router();
const multer  = require('multer')
const upload = multer({ dest: './public/data/uploads/' })

const UserController = require("../controllers/user");
const checkAuth = require('../middleware/check-auth');

/* GET signIn page. */
router.get("/", function (req, res, next) {
  res.render("signin");
});

/* GET login page. */
router.get("/login", function (req, res, next) {
  res.render("login");
});

/* GET home page. */
router.get("/home", checkAuth, (req, res) => {
  res.status(200).render('home');
});

// OAuth Authentication, Just going to this URL will open OAuth screens
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: "email" })
);

// Oauth user data comes to these redirectURLs
router.get("/googleRedirect", passport.authenticate("google"), (req, res) => {
  console.log("redirected", req.user);
  let user = {
    displayName: req.user.displayName,
    name: req.user.name.givenName,
    email: req.user._json.email,
    provider: req.user.provider,
  };
  console.log(user);

  FindOrCreate(user);
  let token = jwt.sign(
    {
      data: user,
    },
    "secret",
    { expiresIn: 60 }
  ); // expiry in seconds
  res.cookie("jwt", token);
  res.redirect("/");
});

router.get(
  "/facebookRedirect",
  passport.authenticate("facebook", { scope: "email" }),
  (req, res) => {
    console.log("redirected", req.user);
    let user = {
      displayName: req.user.displayName,
      name: req.user._json.name,
      email: req.user._json.email,
      provider: req.user.provider,
    };
    console.log(user);

    FindOrCreate(user);
    let token = jwt.sign(
      {
        data: user,
      },
      "secret",
      { expiresIn: 60 }
    ); // expiry in seconds
    res.cookie("jwt", token);
    res.redirect("/");
  }
);

/* POST sign in. */
router.post("/signup", UserController.createUser);

/* POST login. */
router.post("/login", UserController.userLogin);

/* POST form. */
router.post("/form", upload.single('aadhaar'),UserController.formSubmit);

/* GET form. */
router.get("/formview", (req,res) => {
  res.render("homeView");
})

/* GET form data */
router.get("/formdata/:userId", UserController.formData);

module.exports = router;
