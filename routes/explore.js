const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User");
const { ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    // Find all posts, populate the 'user' field, and sort by creation timestamp
    const posts = await Post.find().populate("user").sort({ createdAt: -1 }).lean();
    const userID = req.session.passport.user;

    res.render("explore", {
      userName: req.user.name,
      accountType: req.user.accountType,
      currentUser: req.user,
      profilePicture: req.user.profilePicture,
      posts: posts,
      user: userID
    });
  } catch (err) {
    console.error(err);
    res.render("error", { message: "Error fetching posts" });
  }
});

router.get("/messaging", (req, res) => res.render("messaging", users));

module.exports = router;
