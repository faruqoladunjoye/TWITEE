const express = require('express');
const { auth } = require('./../middlewares/auth');
const twitController = require('./../controllers/twit.controller');
const commentController = require('./../controllers/comment.controller');

const router = express.Router();

router.post('/', auth, twitController.createTwit);
router.delete('/:id', auth, twitController.deleteTwit);
router.get('/:id', auth, twitController.getTwit);
router.get('/', auth, twitController.getTwits);
router.post('/:id/like', auth, twitController.likeTwit);
router.post('/:id/comment', auth, commentController.createComment);

module.exports = router;
