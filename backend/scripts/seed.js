const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import models
const User = require('../models/User');
const Exercise = require('../models/Exercise');
const Meal = require('../models/Meal');
const HealingActivity = require('../models/HealingActivity');
const CompletedHealingActivity = require('../models/CompletedHealingActivity');
const CompletedMeal = require('../models/CompletedMeal');
const Community = require('../models/Community');
const Post = require('../models/Post');
const Challenge = require('../models/Challenge');

// Sample data
const sampleUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    exerciseStreak: 5,
    longestExerciseStreak: 12,
    lastExerciseDate: '2024-01-15',
    healingStreak: 3,
    longestHealingStreak: 7,
    lastHealingDate: '2024-01-15',
    mealStreak: 2,
    longestMealStreak: 5,
    lastMealDate: '2024-01-15',
    mass: 75,
    height: 175,
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    firstName: 'Jane',
    lastName: 'Smith',
    exerciseStreak: 3,
    longestExerciseStreak: 8,
    lastExerciseDate: '2024-01-14',
    healingStreak: 2,
    longestHealingStreak: 5,
    lastHealingDate: '2024-01-14',
    mealStreak: 1,
    longestMealStreak: 3,
    lastMealDate: '2024-01-14',
    mass: 62,
    height: 165,
  },
];

const sampleExercises = [
  {
    name: 'Sun Salutation',
    description: 'A sequence of yoga poses that flow together',
    category: 'yoga',
    difficulty: 'beginner',
    duration: 15,
    calories: 80,
    instructions: [
      'Start in mountain pose',
      'Raise arms overhead',
      'Forward fold',
      'Half lift',
      'Plank pose',
      'Lower to ground',
      'Upward dog',
      'Downward dog',
      'Step forward',
      'Return to mountain pose'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
  },
  {
    name: 'Push-ups',
    description: 'Classic bodyweight exercise for upper body strength',
    category: 'calisthenics',
    difficulty: 'intermediate',
    duration: 10,
    calories: 100,
    equipment: ['None'],
    instructions: [
      'Start in plank position',
      'Lower body to ground',
      'Push back up',
      'Keep body straight'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  },
  {
    name: 'Breathing Meditation',
    description: 'Simple breathing exercise for stress relief',
    category: 'zen',
    difficulty: 'beginner',
    duration: 20,
    calories: 20,
    instructions: [
      'Sit comfortably',
      'Close eyes',
      'Breathe in for 4 counts',
      'Hold for 4 counts',
      'Breathe out for 4 counts',
      'Repeat'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
  {
    name: 'Deadlift',
    description: 'Compound exercise for overall strength',
    category: 'powerlifting',
    difficulty: 'advanced',
    duration: 30,
    calories: 200,
    equipment: ['Barbell', 'Weight plates'],
    injuryWarning: 'Ensure proper form to avoid back injury',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Grip bar with hands shoulder-width apart',
      'Keep back straight',
      'Lift bar by extending hips and knees',
      'Lower bar with controlled movement'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  },
];

const sampleMeals = [
  {
    name: 'Kitchari',
    description: 'Traditional ayurvedic rice and lentil dish',
    category: 'satvik',
    ingredients: ['Basmati rice', 'Mung dal', 'Ghee', 'Turmeric', 'Cumin', 'Coriander'],
    instructions: [
      'Wash rice and dal',
      'Heat ghee in pot',
      'Add spices',
      'Add rice and dal',
      'Cook with water until soft'
    ],
    calories: 350,
    protein: 12,
    carbs: 65,
    fat: 8,
    fiber: 6,
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
  },
  {
    name: 'Golden Milk',
    description: 'Ayurvedic turmeric milk for immunity',
    category: 'ayurvedic',
    ingredients: ['Milk', 'Turmeric', 'Honey', 'Black pepper', 'Ginger'],
    instructions: [
      'Heat milk in pan',
      'Add turmeric and ginger',
      'Add black pepper',
      'Strain and add honey'
    ],
    calories: 120,
    protein: 8,
    carbs: 15,
    fat: 5,
    fiber: 1,
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
  },
  {
    name: 'Quinoa Bowl',
    description: 'Healthy protein-rich bowl',
    category: 'regular',
    ingredients: ['Quinoa', 'Chickpeas', 'Avocado', 'Cherry tomatoes', 'Olive oil'],
    instructions: [
      'Cook quinoa',
      'Drain and rinse chickpeas',
      'Chop vegetables',
      'Mix with olive oil and seasonings'
    ],
    calories: 420,
    protein: 18,
    carbs: 55,
    fat: 15,
    fiber: 12,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400',
  },
];

const sampleHealingActivities = [
  {
    name: 'Abhyanga (Self Massage)',
    description: 'Traditional ayurvedic oil massage',
    category: 'ayurvedic',
    benefits: 'Improves circulation, relieves stress, nourishes skin, promotes sleep',
    instructions: 'Warm sesame oil, apply to entire body, massage in circular motions, let oil absorb for 20 minutes, take warm shower',
    duration: 30,
    imageUrl: 'https://images.unsplash.com/photo-1544161512-6ad1f9baa7b8?w=400',
  },
  {
    name: 'Pranayama',
    description: 'Breathing technique for energy and focus',
    category: 'breathing',
    benefits: 'Increases energy, improves focus, reduces anxiety, balances nervous system',
    instructions: 'Sit in comfortable position, close right nostril, inhale through left nostril, close left nostril, exhale through right nostril, repeat pattern',
    duration: 15,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
  {
    name: 'Neti Pot',
    description: 'Nasal cleansing technique',
    category: 'therapy',
    benefits: 'Clears nasal passages, reduces allergies, improves breathing, sinus relief',
    instructions: 'Mix warm water with salt, fill neti pot, tilt head to side, pour solution through one nostril, let it flow out other nostril, repeat on other side',
    duration: 10,
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
  },
];

const sampleCommunities = [
  {
    name: 'Ayurvedic Wellness',
    type: 'ayurvedic',
    description: 'Community focused on ayurvedic practices and natural healing',
    memberCount: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
  },
  {
    name: 'Yoga Enthusiasts',
    type: 'yoga',
    description: 'Share yoga tips, poses, and mindfulness practices',
    memberCount: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
  {
    name: 'Calisthenics Warriors',
    type: 'calisthenics',
    description: 'Bodyweight training and street workout community',
    memberCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  },
];

const sampleChallenges = [
  {
    title: '30-Day Wellness Challenge',
    description: 'Complete daily exercises, meals, and healing activities',
    type: 'mixed',
    requirements: {
      exercises: 30,
      meals: 30,
      healingActivities: 30,
      duration: 30,
    },
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  },
  {
    title: 'Zen Meditation Challenge',
    description: 'Daily meditation and breathing exercises',
    type: 'healing',
    requirements: {
      healingActivities: 21,
      duration: 21,
    },
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Exercise.deleteMany({});
    await Meal.deleteMany({});
    await HealingActivity.deleteMany({});
    await CompletedHealingActivity.deleteMany({});
    await CompletedMeal.deleteMany({});
    await Community.deleteMany({});
    await Post.deleteMany({});
    await Challenge.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users`);

    // Create exercises
    const exercises = await Exercise.insertMany(sampleExercises);
    console.log(`Created ${exercises.length} exercises`);

    // Create meals
    const meals = await Meal.insertMany(sampleMeals);
    console.log(`Created ${meals.length} meals`);

    // Create healing activities
    const healingActivities = await HealingActivity.insertMany(sampleHealingActivities);
    console.log(`Created ${healingActivities.length} healing activities`);

    // Create communities
    const communities = await Community.insertMany(sampleCommunities);
    console.log(`Created ${communities.length} communities`);

    // Create challenges with creator
    const challenges = [];
    for (const challengeData of sampleChallenges) {
      const challenge = new Challenge({
        ...challengeData,
        createdBy: createdUsers[0]._id,
        participants: [createdUsers[0]._id, createdUsers[1]._id],
      });
      await challenge.save();
      challenges.push(challenge);
    }
    console.log(`Created ${challenges.length} challenges`);

    // Create sample posts
    const posts = [
      {
        title: 'My 30-day yoga challenge journey',
        content: 'Just completed my first week of daily yoga practice. Feeling amazing!',
        author: createdUsers[0]._id,
        community: communities[1]._id, // Yoga Enthusiasts
        likes: [createdUsers[1]._id],
        comments: [],
      },
      {
        title: 'Best ayurvedic morning routine',
        content: 'Here\'s my daily ayurvedic routine that changed my life...',
        author: createdUsers[1]._id,
        community: communities[0]._id, // Ayurvedic Wellness
        likes: [createdUsers[0]._id],
        comments: [],
      },
    ];

    const createdPosts = await Post.insertMany(posts);
    console.log(`Created ${createdPosts.length} posts`);

    console.log('Database seeded successfully!');
    console.log('\nSample login credentials:');
    console.log('Email: john@example.com, Password: password123');
    console.log('Email: jane@example.com, Password: password123');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase(); 