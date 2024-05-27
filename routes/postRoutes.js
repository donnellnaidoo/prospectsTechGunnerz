const express = require('express');
const router = express.Router();
const Post = require("../models/Post");

// Delete Post
router.post('/deletePost', async (req, res) => {
    try {
        const { postId } = req.body;
        await Post.findByIdAndDelete(postId);
        res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Failed to delete post' });
    }
});

// Edit Post
router.post('/editPost', async (req, res) => {
    try {
        const { postId, newContent } = req.body;
        await Post.findByIdAndUpdate(postId, { content: newContent });
        res.json({ message: 'Post edited successfully' });
    } catch (error) {
        console.error('Error editing post:', error);
        res.status(500).json({ message: 'Failed to edit post' });
    }
});

module.exports = router;
