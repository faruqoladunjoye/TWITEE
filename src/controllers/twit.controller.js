const httpStatus = require('http-status');
const Twit = require('./../models/twit.model');
const User = require('./../models/user.model');
const ApiError = require('./../utils/ApiError');
const catchAsync = require('./../utils/catchAsync');

const createTwit = catchAsync(async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  req.body.username = user.username;
  req.body.postedBy = req.userId;

  const twit = await Twit.create({ ...req.body });
  res.status(httpStatus.CREATED).json({
    status: 'success',
    data: {
      twit,
    },
  });
});

const likeTwit = catchAsync(async (req, res) => {
  const userId = req.userId;
  const twitId = req.params.id;

  const twit = await Twit.findById(twitId);

  if (!twit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Twit not found');
  }

  if (twit.likedBy.includes(userId)) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'You have already liked this twit'
    );
  }

  twit.likes += 1;
  twit.likedBy.push(userId);

  await twit.save();

  res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      twit,
    },
  });
});

const getTwit = catchAsync(async (req, res) => {
  const userId = req.userId;
  const twitId = req.params.id;

  const twit = await Twit.findOne({ _id: twitId, postedBy: userId });

  if (!twit) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      'Twit not found or you do not have permission to view it'
    );
  }

  res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      twit,
    },
  });
});

const getTwits = catchAsync(async (req, res) => {
  const userId = req.userId;

  const twits = await Twit.find({ postedBy: userId });

  res.status(httpStatus.OK).json({
    status: 'success',
    results: twits.length,
    data: {
      twits,
    },
  });
});

const deleteTwit = catchAsync(async (req, res) => {
  const userId = req.userId;
  const twitId = req.params.id;

  const twit = await Twit.findOneAndDelete({ _id: twitId, postedBy: userId });

  if (!twit) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      'You do not have permission to delete this tweet.'
    );
  }

  res.status(httpStatus.OK).json({
    message: 'Twit deleted successfully',
  });
});

module.exports = {
  createTwit,
  likeTwit,
  getTwit,
  getTwits,
  deleteTwit,
};
