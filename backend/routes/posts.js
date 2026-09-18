const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const Community = require('../models/Community');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/posts
router.get('/', async (req, res) => {
  try {
    const { communityId, search } = req.query;
    let query = {};

    // Filter by community
    if (communityId) {
      query.community = communityId;
    }

    // Search by title or content
    if (search) {
      query.$text = { $search: search };
    }

    const posts = await Post.find(query)
      .populate('author', 'username firstName lastName profilePicture')
      .populate('community', 'name type description imageUrl')
      .populate('likes', 'username firstName lastName')
      .populate('comments.author', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching posts'
    });
  }
});

// POST /api/posts
router.post('/', auth, [
  body('title')
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must be less than 200 characters'),
  body('content')
    .isLength({ min: 1, max: 2000 })
    .withMessage('Content is required and must be less than 2000 characters'),
  body('communityId')
    .isMongoId()
    .withMessage('Valid community ID is required'),
  body('imageUrl')
    .optional()
    .isURL()
    .withMessage('Image URL must be a valid URL')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: errors.array()[0].msg
      });
    }

    const { title, content, communityId, imageUrl } = req.body;

    // Check if community exists
    const community = await Community.findById(communityId);
    if (!community) {
      return res.status(404).json({
        success: false,
        error: 'Community not found'
      });
    }

    const post = new Post({
      title,
      content,
      author: req.user._id,
      community: communityId,
      imageUrl
    });

    await post.save();

    // Populate the post with author and community data
    await post.populate('author', 'username firstName lastName profilePicture');
    await post.populate('community', 'name type description imageUrl');

    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating post'
    });
  }
});

module.exports = router; 