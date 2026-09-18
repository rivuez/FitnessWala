const express = require('express');
const { body, validationResult } = require('express-validator');
const Meal = require('../models/Meal');
const CompletedMeal = require('../models/CompletedMeal');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/meals
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

    const meals = await Meal.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: meals
    });
  } catch (error) {
    console.error('Get meals error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching meals'
    });
  }
});

// GET /api/meals/completed - MUST come before /:id route
router.get('/completed', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, mealType } = req.query;
    let query = { user: req.user._id };
    
    // Filter by meal type if provided
    if (mealType) {
      query.mealType = mealType;
    }
    
    const completedMeals = await CompletedMeal.find(query)
      .populate('meal')
      .sort({ completedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await CompletedMeal.countDocuments(query);

    res.json({
      success: true,
      data: completedMeals,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get completed meals error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching completed meals'
    });
  }
});

// GET /api/meals/stats - MUST come before /:id route
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Calculate stats based on user's meal data
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all completed meals for the user
    const allCompleted = await CompletedMeal.find({ user: req.user._id })
      .populate('meal');

    // Get this week's and month's completed meals
    const thisWeekCompleted = allCompleted.filter(meal => 
      meal.completedAt >= oneWeekAgo
    );
    const thisMonthCompleted = allCompleted.filter(meal => 
      meal.completedAt >= oneMonthAgo
    );

    // Calculate nutritional totals
    const calculateNutrition = (meals) => {
      return meals.reduce((totals, completedMeal) => {
        const meal = completedMeal.meal;
        const multiplier = completedMeal.portionSize || 1;
        return {
          calories: totals.calories + (meal.calories * multiplier),
          protein: totals.protein + (meal.protein * multiplier),
          carbs: totals.carbs + (meal.carbs * multiplier),
          fat: totals.fat + (meal.fat * multiplier),
          fiber: totals.fiber + (meal.fiber * multiplier)
        };
      }, { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 });
    };

    const totalNutrition = calculateNutrition(allCompleted);
    const weekNutrition = calculateNutrition(thisWeekCompleted);
    const monthNutrition = calculateNutrition(thisMonthCompleted);

    // Calculate meal type breakdown
    const mealTypeBreakdown = {};
    allCompleted.forEach(completedMeal => {
      const mealType = completedMeal.mealType;
      mealTypeBreakdown[mealType] = (mealTypeBreakdown[mealType] || 0) + 1;
    });

    // Calculate category breakdown
    const categoryBreakdown = {};
    allCompleted.forEach(completedMeal => {
      const category = completedMeal.meal.category;
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + 1;
    });

    const stats = {
      totalCompleted: allCompleted.length,
      thisWeekCompleted: thisWeekCompleted.length,
      thisMonthCompleted: thisMonthCompleted.length,
      totalNutrition,
      weekNutrition,
      monthNutrition,
      mealTypeBreakdown,
      categoryBreakdown,
      currentStreak: user.mealStreak || 0,
      longestStreak: user.longestMealStreak || 0,
      lastMealDate: user.lastMealDate
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get meal stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching meal stats'
    });
  }
});

// GET /api/meals/:id
router.get('/:id', async (req, res) => {
  try {
    const meal = await Meal.findById(req.params.id);
    
    if (!meal) {
      return res.status(404).json({
        success: false,
        error: 'Meal not found'
      });
    }

    res.json({
      success: true,
      data: meal
    });
  } catch (error) {
    console.error('Get meal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching meal'
    });
  }
});

// POST /api/meals/:id/complete
router.post('/:id/complete', auth, [
  body('mealType')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Meal type must be breakfast, lunch, dinner, or snack'),
  body('portionSize')
    .optional()
    .isFloat({ min: 0.1, max: 5.0 })
    .withMessage('Portion size must be between 0.1 and 5.0'),
  body('notes')
    .optional()
    .isString()
    .isLength({ max: 500 })
    .withMessage('Notes must be less than 500 characters')
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

    const meal = await Meal.findById(req.params.id);
    if (!meal) {
      return res.status(404).json({
        success: false,
        error: 'Meal not found'
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Check if already completed today (optional - some users might want to log multiple meals per day)
    // For now, we'll allow multiple completions per day but track them separately

    // Create completed meal record
    const completedMeal = new CompletedMeal({
      user: req.user._id,
      meal: req.params.id,
      mealType: req.body.mealType,
      portionSize: req.body.portionSize || 1.0,
      notes: req.body.notes || ''
    });

    await completedMeal.save();

    // Update user's meal streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastMealDate = user.lastMealDate ? new Date(user.lastMealDate) : null;
    if (lastMealDate) {
      lastMealDate.setHours(0, 0, 0, 0);
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (!lastMealDate || lastMealDate.getTime() !== today.getTime()) {
      if (lastMealDate && lastMealDate.getTime() === yesterday.getTime()) {
        // Consecutive day
        user.mealStreak = (user.mealStreak || 0) + 1;
      } else {
        // New streak or broken streak
        user.mealStreak = 1;
      }
      
      user.lastMealDate = today;
      
      // Update longest streak if current streak is longer
      if ((user.mealStreak || 0) > (user.longestMealStreak || 0)) {
        user.longestMealStreak = user.mealStreak;
      }
    }

    await user.save();

    // Populate the completed meal for response
    await completedMeal.populate('meal');

    res.json({
      success: true,
      data: {
        completedMeal,
        user: user.toPublicJSON()
      }
    });
  } catch (error) {
    console.error('Complete meal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while completing meal'
    });
  }
});

// POST /api/meals
router.post('/', auth, [
  body('name')
    .isLength({ min: 1, max: 100 })
    .withMessage('Meal name is required and must be less than 100 characters'),
  body('description')
    .isLength({ min: 1, max: 500 })
    .withMessage('Description is required and must be less than 500 characters'),
  body('category')
    .isIn(['satvik', 'ayurvedic', 'regular', 'breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid category'),
  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),
  body('instructions')
    .isArray({ min: 1 })
    .withMessage('At least one instruction is required'),
  body('calories')
    .isFloat({ min: 0, max: 2000 })
    .withMessage('Calories must be between 0 and 2000'),
  body('protein')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Protein must be between 0 and 100'),
  body('carbs')
    .isFloat({ min: 0, max: 300 })
    .withMessage('Carbs must be between 0 and 300'),
  body('fat')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Fat must be between 0 and 100'),
  body('fiber')
    .isFloat({ min: 0, max: 50 })
    .withMessage('Fiber must be between 0 and 50')
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
      ingredients,
      instructions,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      imageUrl
    } = req.body;

    const meal = new Meal({
      name,
      description,
      category,
      ingredients,
      instructions,
      calories,
      protein,
      carbs,
      fat,
      fiber,
      imageUrl
    });

    await meal.save();

    res.status(201).json({
      success: true,
      data: meal
    });
  } catch (error) {
    console.error('Create meal error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while creating meal'
    });
  }
});

module.exports = router; 