const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const completedHealingActivitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  healingActivity: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HealingActivity',
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
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Indexes for better query performance
completedHealingActivitySchema.index({ user: 1, completedAt: -1 });
completedHealingActivitySchema.index({ healingActivity: 1 });
completedHealingActivitySchema.index({ completedAt: -1 });

// Add pagination plugin
completedHealingActivitySchema.plugin(mongoosePaginate);

module.exports = mongoose.model('CompletedHealingActivity', completedHealingActivitySchema); 