const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  content: { type: String, default: "" },
  image: { type: String, default: "" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  comments: [commentSchema],
  likeCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Post", postSchema);
