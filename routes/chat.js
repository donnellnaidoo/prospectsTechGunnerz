// routes/chat.js
const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');

// Middleware to check if the user is authenticated
// function isAuthenticated(req, res, next) {
//     if (req.session.userId) {
//         return next();
//     }
//     res.redirect('/login'); // Redirect to login if not authenticated
// }
//, isAuthenticated
//, isAuthenticated

// Route to get chat room between two users
router.get('/chat/:userId', async (req, res) => {
    const currentUserId = req.session.passport.user;
    const otherUserId = req.params.userId;

    try {
        console.log(`Fetching chat messages between users: ${currentUserId} and ${otherUserId}`);

        const messages = await Chat.find({
            $or: [
                { sender: currentUserId, receiver: otherUserId },
                { sender: otherUserId, receiver: currentUserId }
            ]
        }).sort('timestamp');

        const otherUser = await User.findById(otherUserId);

        res.render('chat', { messages, otherUser,currentUser: currentUserId });
    } catch (err) {
        console.error('Error fetching chat messages:', err); // Detailed error logging
        res.status(500).send('Server error');
    }
});


// Route to send a new message
router.post('/chat/:userId', async (req, res) => {
    const currentUserId = req.session.passport.user;
    const otherUserId = req.params.userId;
    const { message } = req.body;

    try {
        console.log(`Sending message from ${currentUserId} to ${otherUserId}: ${message}`);

        const newMessage = new Chat({
            sender: currentUserId,
            receiver: otherUserId,
            message
        });

        await newMessage.save();

        // Emit the new message to the room
        const room = [currentUserId, otherUserId].sort().join('-');
        req.app.get('io').to(room).emit('message', {
            sender: currentUserId,
            receiver: otherUserId,
            message,
            timestamp: newMessage.timestamp
        });


        res.redirect(`/chat/${otherUserId}`);
    } catch (err) {
        console.error('Error sending chat message:', err); // Detailed error logging
        res.status(500).send('Server error');
    }
});

module.exports = router;
