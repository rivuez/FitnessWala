const express = require('express');
const { body, validationResult } = require('express-validator');
const HealingActivity = require('../models/HealingActivity');
const CompletedHealingActivity = require('../models/CompletedHealingActivity');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/healing
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Search by name or description
    if (search) {
      query.$text = { $search: search };
    }

    const activities = await HealingActivity.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error('Get healing activities error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching healing activities'
    });
  }
});

// GET /api/healing/stats - MUST come before /:id route
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Calculate stats based on user's healing data
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get all completed activities for the user
    const allCompleted = await CompletedHealingActivity.find({ user: req.user._id })
      .populate('healingActivity');

    // Get this week's completed activities
    const thisWeekCompleted = allCompleted.filter(activity => 
      activity.completedAt >= oneWeekAgo
    );

    // Calculate category breakdown
    const categoryBreakdown = {};
    allCompleted.forEach(activity => {
      const category = activity.healingActivity.category;
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    // Calculate durations
    const totalDuration = allCompleted.reduce((sum, activity) => sum + (activity.duration || 0), 0);
    const thisWeekDuration = thisWeekCompleted.reduce((sum, activity) => sum + (activity.duration || 0), 0);
    const averageDuration = allCompleted.length > 0 ? totalDuration / allCompleted.length : 0;

    const stats = {
      totalCompleted: allCompleted.length,
      thisWeekCompleted: thisWeekCompleted.length,
      totalDuration,
      thisWeekDuration,
      categoryBreakdown,
      averageDuration: Math.round(averageDuration * 100) / 100,
      currentStreak: user.healingStreak || 0,
      longestStreak: user.longestHealingStreak || 0,
      lastHealingDate: user.lastHealingDate
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get healing stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching healing stats'
    });
  }
});

// GET /api/healing/completed - MUST come before /:id route
router.get('/completed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const completedActivities = await CompletedHealingActivity.find({ user: req.user._id })
      .populate('healingActivity')
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await CompletedHealingActivity.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: completedActivities,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get completed healing activities error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching completed healing activities'
    });
  }
});

// GET /api/healing/:id
router.get('/:id', async (req, res) => {
  try {
    const activity = await HealingActivity.findById(req.params.id);
    
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Healing activity not found'
      });
    }

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Get healing activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching healing activity'
    });
  }
});

// POST /api/healing/:id/complete
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const activity = await HealingActivity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        success: false,
        error: 'Healing activity not found'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if already completed today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingCompletion = await CompletedHealingActivity.findOne({
      user: req.user._id,
      healingActivity: req.params.id,
      completedAt: {
        $gte: today,
        $lt: tomorrow
      }
    });

    if (existingCompletion) {
      return res.status(400).json({
        success: false,
        error: 'Healing activity already completed today'
      });
    }

    // Create completed healing activity record
    const completedActivity = new CompletedHealingActivity({
      user: req.user._id,
      healingActivity: req.params.id,
      duration: req.body.duration || activity.duration,
      notes: req.body.notes || ''
    });

    await completedActivity.save();

    // Update user's healing streak
    const lastHealingDate = user.lastHealingDate ? new Date(user.lastHealingDate) : null;
    if (lastHealingDate) {
      lastHealingDate.setHours(0, 0, 0, 0);
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastHealingDate || lastHealingDate.getTime() !== today.getTime()) {
      if (lastHealingDate && lastHealingDate.getTime() === yesterday.getTime()) {
        // Consecutive day
        user.healingStreak = (user.healingStreak || 0) + 1;
      } else {
        // New streak or broken streak
        user.healingStreak = 1;
      }
      
      user.lastHealingDate = today;
      
      // Update longest streak if current streak is longer
      if ((user.healingStreak || 0) > (user.longestHealingStreak || 0)) {
        user.longestHealingStreak = user.healingStreak;
      }
    }

    await user.save();

    // Populate the completed activity for response
    await completedActivity.populate('healingActivity');

    res.json({
      success: true,
      data: {
        completedActivity,
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('Complete healing activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while completing healing activity'
    });
  }
});

// POST /api/healing
router.post('/', auth, [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Activity name is required and must be less than 100 characters'),
  body('description')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description is required and must be less than 500 characters'),
  body('category')
    .isIn(['ayurvedic', 'meditation', 'breathing', 'therapy', 'wellness', 'yoga'])
    .withMessage('Invalid category'),
  body('benefits')
    .isLength({ min: 1, max: 300 })
    .withMessage('Benefits are required and must be less than 300 characters'),
  body('instructions')
    .isLength({ min: 1, max: 1000 })
    .withMessage('Instructions are required and must be less than 1000 characters'),
  body('duration')
    .isInt({ min: 1, max: 300 })
    .withMessage('Duration must be between 1 and 300 minutes')
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
      name,
      description,
      category,
      benefits,
      instructions,
      duration,
      imageUrl
    } = req.body;

    const activity = new HealingActivity({
      name,
      description,
      category,
      benefits,
      instructions,
      duration,
      imageUrl
    });

    await activity.save();

    res.status(201).json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Create healing activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating healing activity'
    });
  }
});

module.exports = router; 