const express = require('express');
const Exercise = require('../models/Exercise');
const User = require('../models/User');
const CompletedExercise = require('../models/CompletedExercise');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/exercises
router.get('/', async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by difficulty
    if (difficulty) {
      query.difficulty = difficulty;
    }

    // Search by name or description
    if (search) {
      query.$text = { $search: search };
    }

    const exercises = await Exercise.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: exercises
    });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching exercises'
    });
  }
});

// GET /api/exercises/stats - MUST come before /:id route
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Calculate stats based on user's exercise data
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get completed exercises for stats
    const [totalCompleted, thisWeekCompleted, allCompleted] = await Promise.all([
      CompletedExercise.countDocuments({ user: req.user._id }),
      CompletedExercise.countDocuments({ 
        user: req.user._id, 
        completedAt: { $gte: oneWeekAgo } 
      }),
      CompletedExercise.find({ user: req.user._id }).populate('exercise')
    ]);

    // Calculate calories and duration
    const totalCaloriesBurned = allCompleted.reduce((sum, ce) => sum + (ce.caloriesBurned || 0), 0);
    const thisWeekCalories = allCompleted
      .filter(ce => ce.completedAt >= oneWeekAgo)
      .reduce((sum, ce) => sum + (ce.caloriesBurned || 0), 0);
    
    const totalDuration = allCompleted.reduce((sum, ce) => sum + (ce.duration || 0), 0);
    const averageDuration = totalCompleted > 0 ? totalDuration / totalCompleted : 0;

    // Calculate category breakdown
    const categoryBreakdown = {};
    allCompleted.forEach(ce => {
      const category = ce.exercise.category;
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    const stats = {
      totalCompleted,
      thisWeekCompleted,
      totalCaloriesBurned,
      thisWeekCalories,
      categoryBreakdown,
      averageDuration: Math.round(averageDuration * 10) / 10, // Round to 1 decimal
      currentStreak: user.exerciseStreak,
      longestStreak: user.longestExerciseStreak,
      lastExerciseDate: user.lastExerciseDate
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get exercise stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching exercise stats'
    });
  }
});

// GET /api/exercises/completed - MUST come before /:id route
router.get('/completed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = '-completedAt' } = req.query;
    
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: sort,
      populate: {
        path: 'exercise',
        select: 'name description category difficulty duration calories instructions imageUrl'
      }
    };

    const completedExercises = await CompletedExercise.paginate(
      { user: req.user._id },
      options
    );

    res.json({
      success: true,
      data: completedExercises.docs,
      pagination: {
        page: completedExercises.page,
        limit: completedExercises.limit,
        totalPages: completedExercises.totalPages,
        totalDocs: completedExercises.totalDocs,
        hasNextPage: completedExercises.hasNextPage,
        hasPrevPage: completedExercises.hasPrevPage
      }
    });
  } catch (error) {
    console.error('Get completed exercises error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching completed exercises'
    });
  }
});

// GET /api/exercises/:id
router.get('/:id', async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: 'Exercise not found'
      });
    }

    res.json({
      success: true,
      data: exercise
    });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching exercise'
    });
  }
});

// POST /api/exercises/:id/complete
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) {
      return res.status(404).json({
        success: false,
        error: 'Exercise not found'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Update user's exercise streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastExerciseDate = user.lastExerciseDate ? new Date(user.lastExerciseDate) : null;
    if (lastExerciseDate) {
      lastExerciseDate.setHours(0, 0, 0, 0);
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastExerciseDate || lastExerciseDate.getTime() !== today.getTime()) {
      if (lastExerciseDate && lastExerciseDate.getTime() === yesterday.getTime()) {
        // Consecutive day
        user.exerciseStreak += 1;
      } else {
        // New streak or broken streak
        user.exerciseStreak = 1;
      }
      
      user.lastExerciseDate = today;
      
      // Update longest streak if current streak is longer
      if (user.exerciseStreak > user.longestExerciseStreak) {
        user.longestExerciseStreak = user.exerciseStreak;
      }
    }

    await user.save();

    // Save the completed exercise
    const { duration, caloriesBurned, notes } = req.body;
    const completedExercise = new CompletedExercise({
      user: req.user._id,
      exercise: exercise._id,
      duration: duration || exercise.duration,
      caloriesBurned: caloriesBurned || exercise.calories,
      notes: notes || ''
    });

    await completedExercise.save();

    // Return updated user data (matching frontend expectation)
    const userResponse = user.toPublicJSON();

    res.json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    console.error('Complete exercise error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while completing exercise'
    });
  }
});

module.exports = router; 