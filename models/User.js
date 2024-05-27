const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String
  },
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model for following
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model for following
  }],
  bio: {
    type: String // Adding bio field
  },
  country: {
    type: String // Adding country field
  },
  phoneNumber: {
    type: String // Adding phone number field
  },
  hometown: {
    type: String // Adding hometown field
  },
  achievements: {
    type: String // Adding achievements field
  },
  position: {
    type: String // Adding position field
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
