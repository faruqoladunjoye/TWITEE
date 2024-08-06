const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const User = require('./../models/user.model');
const catchAsync = require('../utils/catchAsync');

const secretKey = process.env.JWT_SECRET;

const auth = catchAsync(async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
  }
  const token = authHeader.split(' ')[1];

  const decoded = jwt.verify(token, secretKey);
  const user = await User.findOne({ _id: decoded.userId });

  if (!user) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found.'));
  }

  req.user = user;
  req.userId = user._id;
  if (req.params.userId && req.user._id !== req.params.userId) {
    return next(new ApiError(httpStatus.FORBIDDEN, 'Forbidden!'));
  }

  next();
});

module.exports = {
  auth,
};
