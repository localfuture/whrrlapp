const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        const token = jwt.sign(
          { email: req.body.email, userId: result._id },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );
        res.status(201).json({
          token: token,
          message: "User created!",
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication credentials!"
        });
      });
  });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.cookie('jwt', token);
      res.status(200).json({
        token: token,
        expiresIn: 3600,
        userId: fetchedUser._id
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}

exports.formSubmit = (req,res,next) => {
  console.log(req.body);
  const filter = {_id: req.body.userId};
  const update = {
    fullName: req.body.fullName,
    emailId: req.body.emailID,
    mobileNumber: req.body.mobileNumber,
    nationality: req.body.nationality,
  }

  User.findOneAndUpdate(filter, update, {
    new: true
  }).then((result) => {
    if (!result) {
      return res.status(401).json({
        message: "Auth failed"
      });
    }

    res.status(201).json({
      message: "User updated!",
      result: result
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: "Update credentials failed!"
    });
  });
}

exports.formData = (req,res,next) => {

  User.findOne({_id: req.params.userId})
  .then((result) => {
    if (!result) {
      return res.status(401).json({
        message: "Failed to get data"
      });
    }

    res.status(201).json({
      message: "User data",
      result: result
    });
  })
  .catch(err => {
    return res.status(401).json({
      message: "Failed to fetch data"
    });
  });
}