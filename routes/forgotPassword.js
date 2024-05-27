const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // For password hashing (explained later)
const crypto = require('crypto'); // For generating random token
const nodemailer = require('nodemailer'); // For sending emails
const config = require('../models/config'); // Email configuration
const User = require('../models/User'); // Import User model

router.get("/", (req, res) => {
  console.log("GET request to /forgotPassword"); // Log the incoming GET request
  res.render("forgotPassword");
});

module.exports = router;


// Function to generate a random token for password reset
function generateToken() {
  return crypto.randomBytes(20).toString('hex');
}

// Route handler for forgot password request
router.post('/', async (req, res) => {
  const { email } = req.body;

  console.log("Received email:", email); // Log the submitted email

  try {
    // Check if email exists in the database
    const user = await User.findOne({ email });
    console.log("Found user:", user); // Log the retrieved user object (if any)

    if (!user) {
      req.flash('error_msg', 'Email address not found.');
      return res.redirect('/forgotPassword');
    }

    // Generate a random token for password reset
    const resetToken = generateToken();
    console.log("Generated reset token:", resetToken); // Log the generated token

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour expiration

    // Save the updated user with reset token and expiration
    await user.save();
    console.log("Saved user with reset token:", user); // Log the updated user object

    // Prepare email content with the reset link
    const resetUrl = `http://localhost:5000/resetPassword/${resetToken}`; // Replace with your actual domain
    const htmlContent = `
      <h1>Password Reset</h1>
      <p>You have requested a password reset for your account.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">Reset Password</a>
      <p>This link will expire in 1 hour.</p>
    `;

    // Send email with the reset link
    await sendEmail(email, 'Password Reset Request', htmlContent);
    console.log("Email sent successfully"); // Log successful email sending

    req.flash('success_msg', 'A password reset link has been sent to your email address.');
    res.redirect('/forgotPassword');
  } catch (error) {
    console.error("Error handling forgot password request:", error); // Log any errors
    req.flash('error_msg', 'An error occurred. Please try again later.');
    res.redirect('/forgotPassword');
  }
});

// Function to send emails (defined earlier)
async function sendEmail(to, subject, htmlContent) {
    // Configure email transporter with your Gmail credentials
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Set to true if using TLS
      auth: {
        user: 'prospects.za@gmail.com', // Replace with your actual email address
        pass: 'gzch bugl qzvv dbrk' // Replace with your actual email password (use with caution)
      }
    });
  
    // Prepare email options
    const mailOptions = {
      from: '"Prospects" <prospects.za@gmail.com>', // Replace with your name and email
      to,
      subject,
      html: htmlContent
    };
  
    // Send the email
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", info.response); // Log successful email sending
    } catch (error) {
      console.error("Error sending email:", error); // Log errors during email sending
    }
  }

module.exports = router;
