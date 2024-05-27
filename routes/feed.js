const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const User = require("../models/User"); // Import the User model
const { ensureAuthenticated } = require("../config/auth");

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    // Find posts, populate the 'user' field, sort by creation timestamp in descending order
    const posts = await Post.find({
      $or: [{ user: req.user._id }, { user: { $in: req.user.following } }]
    }).populate("user").sort({ createdAt: -1 }).lean();

    const userID = req.session.passport.user;

    res.render("feed", {
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


// Route handler for deleting a post
router.post('/deletePost', ensureAuthenticated, async (req, res) => {
  try {
      const { postId } = req.body;
      console.log("Post ID to delete:", postId); // Log the postId received
      const deletedPost = await Post.findByIdAndDelete(postId);
      if (!deletedPost) {
          console.log('Post not found'); // Log if the post is not found
          return res.status(404).json({ error: 'Post not found' });
      }
      console.log('Post deleted successfully'); // Log success
      res.status(200).json({ success: true, message: 'Post deleted successfully' });
  } catch (error) {
      console.error('Error deleting post:', error); // Log any errors
      res.status(500).json({ error: 'Internal server error' });
  }
});


// Route handler for editing a post
router.post('/editPost', ensureAuthenticated, async (req, res) => {
    const { postId, newContent } = req.body;

    try {
        // Find the post by ID and update its content
        const updatedPost = await Post.findByIdAndUpdate(postId, { content: newContent }, { new: true });
        if (!updatedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.status(200).json({ success: true, message: 'Post edited successfully', post: updatedPost });
    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
