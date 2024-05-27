// feed.js
const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../config/auth').ensureAuthenticated;
const Post = require('../models/Post'); // Make sure the path to your Post model is correct

// Delete post route
router.post('/deletePost', ensureAuthenticated, async (req, res) => {
    const { postId } = req.body;

    if (!postId) {
        return res.status(400).json({ error: 'Post ID is required' });
    }

    try {
        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Edit post route
router.post('/editPost', ensureAuthenticated, async (req, res) => {
    const { postId, newContent } = req.body;

    if (!postId || !newContent) {
        return res.status(400).json({ error: 'Post ID and new content are required' });
    }

    try {
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
