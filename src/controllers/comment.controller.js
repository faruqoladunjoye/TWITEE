const Twit = require('./../models/twit.model');
const User = require('./../models/user.model');
const Comment = require('./../models/comment.model');
const httpStatus = require('http-status');
const ApiError = require('./../utils/ApiError');

const createComment = async (req, res) => {
  const user = await User.findOne({ _id: req.userId });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  req.body.commentedBy = req.userId;
  req.body.twitId = req.params.id;
  req.body.username = user.username;

  const twit = await Twit.findOne({ _id: req.params.id });
  if (!twit) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Twit not found!');
  }

  const twitUsername = twit.username;
  const comment = await Comment.create({ ...req.body });
  res.status(httpStatus.CREATED).json({
    status: 'success',
    message: `You commented on ${twitUsername}'s twit.`,
    data: {
      comment,
    },
  });
};

module.exports = {
  createComment,
};
