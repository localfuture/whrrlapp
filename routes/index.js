var express = require('express');
var router = express.Router();

const UserController = require("../controllers/user");

/* GET signIn page. */
router.get('/', function(req, res, next) {
  res.render('signin');
});

/* GET home page. */
router.get("/home", (req,res) => {
  res.render('home');
})

/* POST sign in. */
router.post("/signup", UserController.createUser);

/* POST login. */
router.post("/login", UserController.userLogin);

module.exports = router;
