const express = require('express');
const { body, validationResult } = require('express-validator');
const Challenge = require('../models/Challenge');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/challenges
router.get('/', async (req, res) => {
  try {
    const { type, isActive, search } = req.query;
    let query = {};

    // Filter by type
    if (type) {
      query.type = type;
    }

    // Filter by active status
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    // Search by title or description
    if (search) {
      query.$text = { $search: search };
    }

    const challenges = await Challenge.find(query)
      .populate('participants', 'username firstName lastName profilePicture')
      .populate('createdBy', 'username firstName lastName profilePicture')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: challenges
    });
  } catch (error) {
    console.error('Get challenges error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching challenges'
    });
  }
});

// GET /api/challenges/:id
router.get('/:id', async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id)
      .populate('participants', 'username firstName lastName profilePicture')
      .populate('createdBy', 'username firstName lastName profilePicture');
    
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Get challenge error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching challenge'
    });
  }
});

// POST /api/challenges/:id/join
router.post('/:id/join', auth, async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found'
      });
    }

    // Check if challenge is active
    if (!challenge.isActive) {
      return res.status(400).json({
        success: false,
        error: 'Challenge is not active'
      });
    }

    // Check if user is already a participant
    if (challenge.participants.includes(req.user._id)) {
      return res.status(400).json({
        success: false,
        error: 'Already joined this challenge'
      });
    }

    // Add user to participants
    challenge.participants.push(req.user._id);
    await challenge.save();

    // Populate the challenge with participant data
    await challenge.populate('participants', 'username firstName lastName profilePicture');
    await challenge.populate('createdBy', 'username firstName lastName profilePicture');

    res.json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Join challenge error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while joining challenge'
    });
  }
});

// POST /api/challenges
router.post('/', auth, [
  body('title')
    .isLength({ min: 1, max: 100 })
    .withMessage('Title is required and must be less than 100 characters'),
  body('description')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description is required and must be less than 500 characters'),
  body('type')
    .isIn(['exercise', 'meal', 'healing', 'mixed'])
    .withMessage('Invalid challenge type'),
  body('requirements.exercises')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Exercises requirement must be a non-negative integer'),
  body('requirements.meals')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Meals requirement must be a non-negative integer'),
  body('requirements.healingActivities')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Healing activities requirement must be a non-negative integer'),
  body('requirements.duration')
    .isInt({ min: 1, max: 365 })
    .withMessage('Duration must be between 1 and 365 days'),
  body('startDate')
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  body('endDate')
    .isISO8601()
    .withMessage('End date must be a valid date'),
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

    const {
      title,
      description,
      type,
      requirements,
      startDate,
      endDate,
      imageUrl
    } = req.body;

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      return res.status(400).json({
        success: false,
        error: 'Start date cannot be in the past'
      });
    }

    if (end <= start) {
      return res.status(400).json({
        success: false,
        error: 'End date must be after start date'
      });
    }

    const challenge = new Challenge({
      title,
      description,
      type,
      requirements,
      startDate: start,
      endDate: end,
      imageUrl,
      createdBy: req.user._id,
      participants: [req.user._id] // Creator automatically joins
    });

    await challenge.save();

    // Populate the challenge with participant data
    await challenge.populate('participants', 'username firstName lastName profilePicture');
    await challenge.populate('createdBy', 'username firstName lastName profilePicture');

    res.status(201).json({
      success: true,
      data: challenge
    });
  } catch (error) {
    console.error('Create challenge error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating challenge'
    });
  }
});

module.exports = router; 