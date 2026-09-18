const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
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
    enum: ['zen', 'yoga', 'calisthenics', 'powerlifting', 'cardio', 'strength', 'flexibility']
  },
  equipment: [{
    type: String,
    trim: true
  }],
  injuryWarning: {
    type: String,
    maxlength: 200
  },
  instructions: [{
    type: String,
    required: true,
    trim: true
  }],
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced']
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 300 // 5 hours max
  },
  calories: {
    type: Number,
    required: true,
    min: 0,
    max: 1000
  },
  imageUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
exerciseSchema.index({ category: 1, difficulty: 1 });
exerciseSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Exercise', exerciseSchema); 