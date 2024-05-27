const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    // Get the total number of posts
    const totalPosts = await Post.countDocuments();

    // Get the total number of users
    const totalUsers = await User.countDocuments();

    // Get the number of followers for the current user
    const user = await User.findById(req.user._id).populate('following');
    const totalFollowers = user.following.length;

    // Get the number of posts made by the current user
    const userPostsCount = await Post.countDocuments({ user: req.user._id });

    // Fetch additional user-related data for analytics
    const userData = await User.findById(req.user._id).select('createdAt');

    const userID = req.session.passport.user;
    res.render('analytics', {
      userName: req.user.name,
      accountType: req.user.accountType,
      totalPosts,
      totalUsers,
      totalFollowers,
      userPostsCount,
      userCreatedAt: userData.createdAt,
      currentUser: req.user,
      profilePicture: req.user.profilePicture,
      user : userID
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { message: 'Error fetching analytics data' });
  }
});

module.exports = router;
