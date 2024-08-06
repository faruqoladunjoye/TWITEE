const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  dateOfCreation: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', function (next) {
  if (this.isModified('email')) {
    const emailParts = this.email.split('@');
    this.username = emailParts[0];
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
