const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Route for searching users
router.get('/', async (req, res) => {
    const searchTerm = req.query.q;
    if (!searchTerm) {
        return res.status(400).json({ message: 'Search term is required' });
    }

    try {
        const users = await User.find({
            $or: [
                { name: new RegExp(searchTerm, 'i') }, // Search in name
                { email: new RegExp(searchTerm, 'i') } // Search in email
            ]
        });
        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
