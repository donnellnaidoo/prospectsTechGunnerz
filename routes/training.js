const express = require("express");
const router = express.Router();
const path = require("path");
const { ensureAuthenticated } = require("../config/auth");
const Post = require('../models/Post');
const User = require('../models/User');


router.get("/", ensureAuthenticated, (req, res) => {
  const userID = req.session.passport.user;

  res.render("training", {
    userName: req.user.name,
    accountType: req.user.accountType,
    currentUser: req.user,
    profilePicture: req.user.profilePicture,
    user: userID
  });
});

router.get("/messaging", (req, res) => res.render("messaging", users));
module.exports = router;
