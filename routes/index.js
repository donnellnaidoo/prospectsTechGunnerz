// const express = require("express");
// const router = express.Router();
// const path = require("path");
// const bcrypt = require("bcrypt");
// const passport = require("passport");
// const nodemailer = require("nodemailer");
// // User model
// const User = require("../models/User");

// router.get("/", (req, res) => res.render("index"));

// const passConditions = /\d+\w+\W/;

// // Function to send emails
// async function sendEmail(to, subject, htmlContent) {
//   const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 587,
//     secure: false,
//     auth: {
//       user: 'prospects.za@gmail.com',
//       pass: 'gzch bugl qzvv dbrk'
//     }
//   });

//   const mailOptions = {
//     from: '"Prospects" <prospects.za@gmail.com>',
//     to,
//     subject,
//     html: htmlContent
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log("Email sent successfully:", info.response);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// }

// // Sign-up post
// router.post("/sign_up", (req, res) => {
//   console.log(req.body);

//   const { name, email, password, confirmPassword, accountType } = req.body;

//   let errors = [];

//   // Validation
//   if (!name || !email || !password || !confirmPassword || !accountType) {
//     errors.push({ msg: "Please enter all fields" });
//   }

//   if (password !== confirmPassword) {
//     errors.push({ msg: "Passwords do not match" });
//   }

//   if (password.length < 8 || passConditions.test(password) != true) {
//     errors.push({
//       msg: "Password not strong enough \n Must include at least 1 number and special character \n Must be at least 8 characters long",
//     });
//   }

//   if (errors.length > 0) {
//     res.render("registration", {
//       errors,
//       name,
//       email,
//       confirmPassword,
//       password,
//       accountType,
//     });
//   } else {
//     User.findOne({ email }).then((user) => {
//       if (user) {
//         errors.push({ msg: "Email already exists" });
//         res.render("registration", {
//           errors,
//           name,
//           email,
//           password,
//           confirmPassword,
//           accountType,
//         });
//       } else {
//         const newUser = new User({
//           name,
//           email,
//           password,
//           accountType,
//         });

//         bcrypt.genSalt(10, (err, salt) => {
//           bcrypt.hash(newUser.password, salt, async (err, hash) => {
//             if (err) throw err;

//             newUser.password = hash;

//             try {
//               await newUser.save();

//               const welcomeMessage = `
//               <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
//                 <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
//                     <h1 style="color: #333333; text-align: center; margin-bottom: 20px;">Welcome to Our Platform, ${name}!</h1>
//                     <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Thank you for signing up with us. We're excited to have you on board!</p>
//                     <p style="color: #333333; font-size: 18px; font-weight: bold; margin-bottom: 10px;">Here's what you can look forward to:</p>
//                     <ul style="color: #555555; font-size: 16px; line-height: 1.5; margin-left: 20px; margin-bottom: 20px;">
//                         <li style="margin-bottom: 10px;"><strong>Connect with Scouts and Teams:</strong> Showcase your skills and achievements to a wide audience.</li>
//                         <li style="margin-bottom: 10px;"><strong>Discover New Opportunities:</strong> Find and connect with scouts, teams, and other players to take your career to the next level.</li>
//                         <li style="margin-bottom: 10px;"><strong>Enhance Your Profile:</strong> Create a detailed profile, upload videos, and highlight your accomplishments.</li>
//                         <li style="margin-bottom: 10px;"><strong>Stay Informed:</strong> Receive notifications about relevant opportunities, events, and updates.</li>
//                     </ul>
//                     <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">We're committed to helping you succeed and achieve your football dreams. If you have any questions or need assistance, our support team is always here to help.</p>
//                     <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Once again, welcome! We’re excited to see your journey unfold.</p>
//                     <p style="color: #333333; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Best Regards,</p>
//                     <p style="color: #333333; font-size: 16px;">The Prospect's Team</p>
//                 </div>
//               </body>
//               `;
//               await sendEmail(newUser.email, 'Welcome to Our Platform!', welcomeMessage);

//               res.redirect("/login"); // Redirect to login page after successful registration
//             } catch (err) {
//               console.error(err);
//               errors.push({ msg: "Error creating user" });
//               res.render("registration", {
//                 errors,
//                 name,
//                 email,
//                 confirmPassword,
//                 password,
//                 accountType,
//               });
//             }
//           });
//         });
//       }
//     });
//   }
// });

// // Login handle
// router.post("/login", (req, res, next) => {
//   passport.authenticate("local", {
//     successRedirect: "/feed",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })(req, res, next);
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const path = require("path");
const bcrypt = require("bcrypt");
const passport = require("passport");
const nodemailer = require("nodemailer");
const multer = require('multer');

// User model
const User = require("../models/User");

router.get("/", (req, res) => res.render("index"));

const passConditions = /\d+\w+\W/;

// Function to send emails
async function sendEmail(to, subject, htmlContent) {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'prospects.za@gmail.com',
      pass: 'gzch bugl qzvv dbrk'
    }
  });

  const mailOptions = {
    from: '"Prospects" <prospects.za@gmail.com>',
    to,
    subject,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

// // Configure multer for file upload
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/public/profilePics'); // Directory where files will be uploaded
//   },
  
// });

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  }
});


const upload = multer({ storage: storage });

// Sign-up post
router.post("/sign_up", upload.single('profilePicture'), (req, res) => {
  const { name, email, password, confirmPassword, accountType } = req.body;

  let errors = [];

  // Validation
  if (!name || !email || !password || !confirmPassword || !accountType) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password !== confirmPassword) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 8 || passConditions.test(password) != true) {
    errors.push({
      msg: "Password not strong enough \n Must include at least 1 number and special character \n Must be at least 8 characters long",
    });
  }

  if (errors.length > 0) {
    res.render("registration", {
      errors,
      name,
      email,
      confirmPassword,
      password,
      accountType,
    });
  } else {
    User.findOne({ email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("registration", {
          errors,
          name,
          email,
          password,
          confirmPassword,
          accountType,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          accountType,
          profilePicture: req.file ? req.file.filename : 'default.jpg', // Use uploaded profile picture or default image
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, async (err, hash) => {
            if (err) throw err;

            newUser.password = hash;

            try {
              await newUser.save();

              const welcomeMessage = `
              <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <h1 style="color: #333333; text-align: center; margin-bottom: 20px;">Welcome to Our Platform, ${name}!</h1>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Thank you for signing up with us. We're excited to have you on board!</p>
                    <p style="color: #333333; font-size: 18px; font-weight: bold; margin-bottom: 10px;">Here's what you can look forward to:</p>
                    <ul style="color: #555555; font-size: 16px; line-height: 1.5; margin-left: 20px; margin-bottom: 20px;">
                        <li style="margin-bottom: 10px;"><strong>Connect with Scouts and Teams:</strong> Showcase your skills and achievements to a wide audience.</li>
                        <li style="margin-bottom: 10px;"><strong>Discover New Opportunities:</strong> Find and connect with scouts, teams, and other players to take your career to the next level.</li>
                        <li style="margin-bottom: 10px;"><strong>Enhance Your Profile:</strong> Create a detailed profile, upload videos, and highlight your accomplishments.</li>
                        <li style="margin-bottom: 10px;"><strong>Stay Informed:</strong> Receive notifications about relevant opportunities, events, and updates.</li>
                    </ul>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">We're committed to helping you succeed and achieve your football dreams. If you have any questions or need assistance, our support team is always here to help.</p>
                    <p style="color: #555555; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">Once again, welcome! We’re excited to see your journey unfold.</p>
                    <p style="color: #333333; font-size: 16px; font-weight: bold; margin-bottom: 10px;">Best Regards,</p>
                    <p style="color: #333333; font-size: 16px;">The Prospect's Team</p>
                </div>
              </body>
              `;
              await sendEmail(newUser.email, 'Welcome to Our Platform!', welcomeMessage);

              res.redirect("/login"); // Redirect to login page after successful registration
            } catch (err) {
                            console.error(err);
              errors.push({ msg: "Error creating user" });
              res.render("registration", {
                errors,
                name,
                email,
                confirmPassword,
                password,
                accountType,
              });
            }
          });
        });
      }
    });
  }
});

// Login handle
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/feed",
    failureRedirect: "/login",
    failureFlash: true,
  })(req, res, next);
});

router.get('/logout', function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

module.exports = router;
