const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  profilePicture: {
    type: String,
    default: null
  },
  exerciseStreak: {
    type: Number,
    default: 0
  },
  lastExerciseDate: {
    type: Date,
    default: null
  },
  longestExerciseStreak: {
    type: Number,
    default: 0
  },
  healingStreak: {
    type: Number,
    default: 0
  },
  lastHealingDate: {
    type: Date,
    default: null
  },
  longestHealingStreak: {
    type: Number,
    default: 0
  },
  mealStreak: {
    type: Number,
    default: 0
  },
  lastMealDate: {
    type: Date,
    default: null
  },
  longestMealStreak: {
    type: Number,
    default: 0
  },
  mass: {
    type: Number, // in kg
    min: 20,
    max: 300
  },
  height: {
    type: Number, // in cm
    min: 100,
    max: 250
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile (without password)
userSchema.methods.toPublicJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema); 