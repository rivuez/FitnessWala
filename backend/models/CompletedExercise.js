const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const completedExerciseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  caloriesBurned: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
completedExerciseSchema.index({ user: 1, completedAt: -1 });
completedExerciseSchema.index({ exercise: 1 });
completedExerciseSchema.index({ completedAt: -1 });

// Add pagination plugin
completedExerciseSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('CompletedExercise', completedExerciseSchema); 