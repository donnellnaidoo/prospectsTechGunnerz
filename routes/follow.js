const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route to follow a user
router.post('/:userId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.user._id);
        const userToFollow = await User.findById(req.params.userId);

        if (!userToFollow) {
            return; // User not found, but no response is sent
        }

        if (currentUser.following.includes(userToFollow._id)) {
            return; // Already following this user, but no response is sent
        }

        // Use $addToSet to avoid duplicates
        await User.findByIdAndUpdate(currentUser._id, { $addToSet: { following: userToFollow._id } });
        await User.findByIdAndUpdate(userToFollow._id, { $addToSet: { followers: currentUser._id } });

        // End the response without sending anything
        res.end();
    } catch (error) {
        console.error('Error following user:', error);
        // No response is sent even in case of error
    }
});

module.exports = router;
