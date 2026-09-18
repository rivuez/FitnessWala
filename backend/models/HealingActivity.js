const mongoose = require('mongoose');

const healingActivitySchema = new mongoose.Schema({
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
    enum: ['ayurvedic', 'meditation', 'breathing', 'therapy', 'wellness', 'yoga']
  },
  benefits: {
    type: String,
    required: true,
    maxlength: 300
  },
  instructions: {
    type: String,
    required: true,
    maxlength: 1000
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    max: 300 // 5 hours max
  },
  imageUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Index for better query performance
healingActivitySchema.index({ category: 1 });
healingActivitySchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('HealingActivity', healingActivitySchema); 