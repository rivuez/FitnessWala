const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['ayurvedic', 'satvik', 'yoga', 'calisthenics', 'powerlifting', 'general']
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  memberCount: {
    type: Number,
    default: 0,
    min: 0
  },
  imageUrl: {
    type: String,
    default: null
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for better query performance
communitySchema.index({ type: 1 });
communitySchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Community', communitySchema); 