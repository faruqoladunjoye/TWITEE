const httpStatus = require('http-status');
const User = require('./../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsync = require('./../utils/catchAsync');
const ApiError = require('./../utils/ApiError');
const emailService = require('./../services/emailService');

const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists');
  }

  const username = email.split('@')[0];

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    username,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  await emailService.sendOnboardingEmail(user.email, user.name);
  res.status(httpStatus.CREATED).send({
    status: 'success',
    message: 'Registration successful',
    data: {
      accessToken: token,
      user,
    },
  });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Provide Login credentials');
  }

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect Login details');
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(httpStatus.OK).send({
    status: 'success',
    message: 'Login successful',
    data: {
      accessToken: token,
      user,
    },
  });
});

module.exports = {
  register,
  login,
};
