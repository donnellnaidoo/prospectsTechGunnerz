const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejs = require("ejs");
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');
const { ensureAuthenticated } = require("./config/auth");
const chatRouter = require("./routes/chat")
const http = require('http');
const server = http.createServer(app);
const socketio = require("socket.io");
const sharedsession = require("express-socket.io-session");
const Chat = require('./models/Chat');

const PORT = process.env.PORT || 5000;

const sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
});

app.use(sessionMiddleware);

//socket io
const io = socketio(server);
// Attach io instance to the app
app.set('io', io);

io.use(sharedsession(sessionMiddleware, {
    autoSave: true
  }));

io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    socket.on('joinRoom', ({ userId, otherUserId }) => {
        const room = [userId, otherUserId].sort().join('-');
        socket.join(room);

        socket.on('chatMessage', async ({ senderId, receiverId, message }) => {
            const newMessage = new Chat({
                sender: senderId,
                receiver: receiverId,
                message
            });

            await newMessage.save();

            io.to(room).emit('message', {
                sender: senderId,
                receiver: receiverId,
                message,
                timestamp: newMessage.timestamp
            });
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Passport config
require('./config/passport')(passport);

// DB Config
const db = require("./config/keys").MongoURI;

// Connect to MongoDB
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// ejs
app.set("view engine", "ejs");

// Bodyparser
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// Set global variables for flash messages
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use("/", require("./routes/index"));
app.use("/feed", require("./routes/feed"));
app.use("/messaging", require("./routes/messaging"));
app.use("/registration", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/profile", require("./routes/profile"));
app.use("/explore", require("./routes/explore"));
app.use("/training", require("./routes/training"));
app.use("/settings", require("./routes/settings"));
app.use("/forgotPassword", require("./routes/forgotPassword"));
app.use("/editProfile", require("./routes/editProfile"));
app.use("/analytics", require("./routes/analytics"));
app.use("/about", require("./routes/about"));
app.use("/help", require("./routes/help"));
app.use(chatRouter);
const Post = require('./models/Post'); // Import the Post model

// Multer storage configuration
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Multer upload initialization
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // Increase file size limit to 10MB or appropriate size for your needs
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).single('postImage');

function checkFileType(file, cb) {
    // Allowed file types
    const filetypes = /jpeg|jpg|png|gif|mp4/;
    // Check extname
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mimetype
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images and videos only!');
    }
}

// Route to handle post creation
app.post('/createPost', ensureAuthenticated, (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            req.flash('error_msg', 'Error uploading file: ' + err);
            return res.redirect('/feed');
        }
        
        // Check if no file is selected
        if (req.file === undefined) {
            req.flash('error_msg', 'No file selected!');
            return res.redirect('/feed');
        }
        
        const postContent = req.body.postContent;
        const postImage = req.file.filename;

        try {
            // Insert post data into MongoDB
            const newPost = await Post.create({
                content: postContent,
                image: postImage,
                user: req.user._id // Associate post with the current user
            });

            // Add post reference to user's posts array
            req.user.posts.push(newPost);
            await req.user.save();

            req.flash('success_msg', 'Post created successfully!');
            // Redirect to /feed after a short delay (1 second)
            setTimeout(() => {
                res.redirect('/feed');
            }, 1000);
        } catch (err) {
            console.error("Error creating post:", err);
            req.flash('error_msg', 'Error creating post.');
            res.redirect('/feed');
        }
    });
});



// Route to render the feed
app.get('/feed', ensureAuthenticated, async (req, res) => {
    try {
        // Fetch posts from users the authenticated user is following
        const posts = await Post.find({ user: { $in: req.user.following } }).populate('user').lean();
        res.render('feed', { userName: req.user.username, accountType: req.user.accountType, posts: posts });
    } catch (err) {
        console.error(err);
        res.render('error', { message: "Error fetching posts" });
    }
});


app.use('/uploads', express.static('uploads'));
const searchRouter = require('./routes/search');
app.use('/api/search', searchRouter);



const followRouter = require("./routes/follow");
const unfollowRouter = require("./routes/unfollow");
app.use("/api/follow", followRouter); // Add follow route
app.use("/api/unfollow", unfollowRouter); // Add unfollow route

// In app.js or server.js
const profileRoutes = require('./routes/editProfile');
app.use('/profile', profileRoutes);


// backend.js

// Route handler for deleting a post
app.post('/deletePost/:postId', ensureAuthenticated, async (req, res) => {
    try {
        const postId = req.params.postId;
        console.log("Post ID to delete:", postId); // Log the postId received

        // Find the post by ID and delete it from the database
        const deletedPost = await Post.findByIdAndDelete(postId);
        
        if (!deletedPost) {
            console.log('Post not found');
            return res.status(404).json({ error: 'Post not found' });
        }

        console.log('Post deleted successfully');
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



server.listen(PORT, console.log("Server started on port ${PORT}"));