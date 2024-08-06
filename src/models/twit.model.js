const mongoose = require('mongoose');

const twitSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: [280, 'The maximum length of a Twit is 280 characters'],
  },
  username: {
    type: String,
    ref: 'User',
  },
  dateOfCreation: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likedBy: {
    type: [mongoose.Schema.ObjectId],
    ref: 'User',
    default: [],
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
  },
});

const Twit = mongoose.model('Twit', twitSchema);

module.exports = Twit;
