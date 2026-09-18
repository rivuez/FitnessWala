const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  title: {
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
  type: {
    type: String,
    required: true,
    enum: ['exercise', 'meal', 'healing', 'mixed']
  },
  requirements: {
    exercises: {
      type: Number,
      min: 0,
      default: 0
    },
    meals: {
      type: Number,
      min: 0,
      default: 0
    },
    healingActivities: {
      type: Number,
      min: 0,
      default: 0
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 365 // 1 year max
    }
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  imageUrl: {
    type: String,
    default: null
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
challengeSchema.index({ isActive: 1, endDate: 1 });
challengeSchema.index({ participants: 1 });
challengeSchema.index({ type: 1 });

// Virtual for participant count
challengeSchema.virtual('participantCount').get(function() {
  return this.participants.length;
});

// Method to check if challenge is ongoing
challengeSchema.methods.isOngoing = function() {
  const now = new Date();
  return this.isActive && now >= this.startDate && now <= this.endDate;
};

// Method to check if challenge is completed
challengeSchema.methods.isCompleted = function() {
  const now = new Date();
  return now > this.endDate;
};

module.exports = mongoose.model('Challenge', challengeSchema); 