const express = require("express");
const router = express.Router();
const User = require("../models/User"); // Import the User model
const Post = require("../models/Post");
const { ensureAuthenticated } = require("../config/auth");

// Route to render the authenticated user's profile
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    // Fetch the authenticated user's information from the database
    const user = await User.findById(req.user._id).lean();
    res.render("profile", {
      userName: user.name,
      accountType: user.accountType,
      isCurrentUser: isCurrentUser,
      isFollowing: isFollowing,
      profilePicture: req.user.profilePicture, // Here you're passing the profile picture
      user,
      posts: posts
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});

// Route to render another user's profile
// router.get("/:userId", ensureAuthenticated, async (req, res) => {
//   try {
//     // Fetch the user information based on the provided userId parameter
//     const user = await User.findById(req.params.userId).lean();
    
//     if (!user) {
//       // If user not found, render an error page
//       return res.status(404).render("error", { message: "User not found" });
//     }
    
//     // Check if the profile belongs to the signed-in user
//     const isCurrentUser = req.user._id.toString() === req.params.userId;
    
//     // Render the profile page with user information and the isCurrentUser flag
//     res.render("profile", {
//       userName: user.name,
//       accountType: user.accountType,
//       isCurrentUser: isCurrentUser,
//       user,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).render("error", { message: "Internal Server Error" });
//   }
// });
// Route to render another user's profile
router.get("/:userId", ensureAuthenticated, async (req, res) => {
  try {
    // Fetch the user information based on the provided userId parameter
    const user = await User.findById(req.params.userId).lean();
    
    if (!user) {
      // If user not found, render an error page
      return res.status(404).render("error", { message: "User not found" });
    }
    
    // Check if the profile belongs to the signed-in user
    const isCurrentUser = req.user._id.toString() === req.params.userId;

    let isFollowing = false;
    if (req.user.following.includes(req.params.userId)) {
      isFollowing = true;
    }

    let posts;
    if (isCurrentUser) {
      // If the profile belongs to the signed-in user, fetch their posts
      posts = await Post.find({ user: req.user._id }).lean();
    } else {
      // If viewing another user's profile, fetch their public posts
      posts = await Post.find({ user: req.params.userId }).lean();
    }

    // Render the profile page with user information, the isCurrentUser flag, the isFollowing flag, and the fetched posts
    res.render("profile", {
      userName: user.name,
      accountType: user.accountType,
      isCurrentUser: isCurrentUser,
      isFollowing: isFollowing,
      profilePicture: req.user.profilePicture, // Here you're passing the profile picture
      user,
      posts: posts
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});




module.exports = router;
