const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    minlength: [3, 'Minimum of 3 characters!'],
    maxlength: [50, 'Maximum of 140 characters!'],
    required: [true, 'Provide a comment.'],
  },
  username: {
    type: String,
    ref: 'User',
  },
  commentedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  twitId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Twit',
    required: true,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
