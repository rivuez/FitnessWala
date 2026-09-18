const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  category: {
    type: String,
    required: true,
    enum: ['satvik', 'ayurvedic', 'regular', 'breakfast', 'lunch', 'dinner', 'snack']
  },
  ingredients: [{
    type: String,
    required: true,
    trim: true
  }],
  instructions: [{
    type: String,
    required: true,
    trim: true
  }],
  calories: {
    type: Number,
    required: true,
    min: 0,
    max: 2000
  },
  protein: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  carbs: {
    type: Number,
    required: true,
    min: 0,
    max: 300
  },
  fat: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  fiber: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },
  imageUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
mealSchema.index({ category: 1 });
mealSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Meal', mealSchema); 