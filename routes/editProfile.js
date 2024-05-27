const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../models/User"); // Import the User model
const Post = require("../models/Post");
const { ensureAuthenticated } = require("../config/auth");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Route to render the authenticated user's profile
router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    // Fetch the authenticated user's information from the database
    const userID = req.session.passport.user;
    const user = await User.findById(req.user._id).lean();
    res.render("editProfile", {
      userName: user.name,
      accountType: user.accountType,
      isCurrentUser: true, // Flag to indicate the profile belongs to the signed-in user
      profilePicture: user.profilePicture,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});

router.post('/edit', upload.single('profilePicture'), async (req, res) => {
  try {
    const currentUser = req.user;
    const userID = req.session.passport.user;

    // Update the user's profile information based on the form data
    currentUser.name = req.body.name;
    currentUser.email = req.body.email;
    currentUser.bio = req.body.bio;
    currentUser.country = req.body.country;
    currentUser.phoneNumber = req.body.phoneNumber;
    currentUser.hometown = req.body.hometown;
    currentUser.achievements = req.body.achievements;
    currentUser.position = req.body.position;

    if (req.file) {
      currentUser.profilePicture = req.file.filename;
    }

    // Save the updated user object to the database
    await currentUser.save();

    // Redirect the user back to their profile page after successful update
    res.redirect(`/profile/${userID}`);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).render('error', { message: 'Failed to update profile' });
  }
});

module.exports = router;
