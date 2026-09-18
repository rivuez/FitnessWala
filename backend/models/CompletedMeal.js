const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const completedMealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Meal',
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  portionSize: {
    type: Number, // multiplier for the original meal's nutritional values
    default: 1.0,
    min: 0.1,
    max: 5.0
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
completedMealSchema.index({ user: 1, completedAt: -1 });
completedMealSchema.index({ meal: 1 });
completedMealSchema.index({ completedAt: -1 });
completedMealSchema.index({ mealType: 1 });

// Add pagination plugin
completedMealSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('CompletedMeal', completedMealSchema); 