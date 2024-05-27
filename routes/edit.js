const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuthenticated } = require('../config/auth');

// Route to handle profile editing form submission
router.post('/edit', ensureAuthenticated, async (req, res) => {
    try {
        // Assuming the current user is authenticated and stored in req.user
        const currentUser = req.user;

        // Update the user's profile information based on the form data
        currentUser.name = req.body.name;
        currentUser.email = req.body.email;
        currentUser.bio = req.body.bio;

        // Save the updated user object to the database
        await currentUser.save();

        // Redirect the user back to their profile page after successful update
        res.redirect(`/profile/${currentUser._id}`);
    } catch (error) {
        console.error('Error updating profile:', error);
        // Handle the error gracefully (e.g., render an error page)
        res.status(500).render('error', { message: 'Failed to update profile' });
    }
});

module.exports = router;
