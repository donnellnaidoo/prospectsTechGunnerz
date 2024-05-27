const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to unfollow a user
router.post('/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id); // Assuming the current user is authenticated
        const userToUnfollow = await User.findById(req.params.userId);

        if (!userToUnfollow) {
            return res.status(404).send(); // User not found
        }

        // Check if the current user is following the user to unfollow
        const followingIndex = currentUser.following.indexOf(userToUnfollow._id);
        if (followingIndex === -1) {
            return res.status(400).send(); // Not following this user
        }

        // Remove the user from the current user's following list
        currentUser.following.splice(followingIndex, 1);
        await currentUser.save();

        // Remove the current user from the user to unfollow's followers list
        const followersIndex = userToUnfollow.followers.indexOf(currentUser._id);
        if (followersIndex !== -1) {
            userToUnfollow.followers.splice(followersIndex, 1);
            await userToUnfollow.save();
        }

        return res.status(204).send(); // User unfollowed successfully
    } catch (error) {
        console.error('Error unfollowing user:', error);
        return res.status(500).send(); // Internal Server Error
    }
});

module.exports = router;
