# Fitness Wala 2.0 Backend

A comprehensive backend API for the Fitness Wala 2.0 wellness application, built with Express.js and MongoDB.

## Features

- **Authentication**: JWT-based user authentication with registration and login
- **User Management**: Profile updates and user data management
- **Exercises**: Exercise library with categories, difficulty levels, and completion tracking
- **Meals**: Meal planning with nutritional information and ayurvedic recipes
- **Healing Activities**: Wellness activities including meditation, yoga, and ayurvedic practices
- **Communities**: User communities for different wellness practices
- **Posts**: Social features with community posts and interactions
- **Challenges**: Wellness challenges with progress tracking
- **Statistics**: Comprehensive tracking of user progress and streaks

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: helmet, cors, rate limiting

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `config.env` and update the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/fitness_wala
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - For local development: `mongod`
   - Or use MongoDB Atlas for cloud hosting

5. **Run the application**
   ```bash
   # Development mode with auto-restart
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User Management
- `PUT /api/users/profile` - Update user profile

### Exercises
- `GET /api/exercises` - Get all exercises (with filters)
- `GET /api/exercises/:id` - Get specific exercise
- `POST /api/exercises/:id/complete` - Mark exercise as complete
- `GET /api/exercises/completed` - Get completed exercises
- `GET /api/exercises/stats` - Get exercise statistics

### Meals
- `GET /api/meals` - Get all meals (with filters)
- `GET /api/meals/:id` - Get specific meal
- `POST /api/meals/:id/complete` - Mark meal as complete
- `POST /api/meals` - Create new meal

### Healing Activities
- `GET /api/healing` - Get all healing activities (with filters)
- `GET /api/healing/:id` - Get specific healing activity
- `POST /api/healing/:id/complete` - Mark healing activity as complete
- `POST /api/healing` - Create new healing activity
- `GET /api/healing/completed` - Get completed healing activities
- `GET /api/healing/stats` - Get healing statistics

### Communities
- `GET /api/communities` - Get all communities (with filters)
- `GET /api/communities/:id` - Get specific community

### Posts
- `GET /api/posts` - Get all posts (with filters)
- `POST /api/posts` - Create new post

### Challenges
- `GET /api/challenges` - Get all challenges (with filters)
- `GET /api/challenges/:id` - Get specific challenge
- `POST /api/challenges/:id/join` - Join a challenge
- `POST /api/challenges` - Create new challenge

## Database Schema

### User
- Basic info: username, email, password, firstName, lastName
- Profile: profilePicture, mass, height
- Streaks: exerciseStreak, healingStreak, longestStreak
- Timestamps: createdAt, updatedAt

### Exercise
- Details: name, description, category, difficulty
- Instructions: equipment, injuryWarning, instructions array
- Metrics: duration, calories
- Media: imageUrl

### Meal
- Details: name, description, category
- Recipe: ingredients, instructions
- Nutrition: calories, protein, carbs, fat, fiber
- Media: imageUrl

### Healing Activity
- Details: name, description, category
- Wellness: benefits, instructions
- Metrics: duration
- Media: imageUrl

### Community
- Details: name, type, description
- Members: memberCount, members array
- Media: imageUrl

### Post
- Content: title, content, imageUrl
- Relations: author, community
- Social: likes, comments
- Timestamps: createdAt, updatedAt

### Challenge
- Details: title, description, type
- Requirements: exercises, meals, healingActivities, duration
- Participants: participants array, createdBy
- Timeline: startDate, endDate, isActive
- Media: imageUrl

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Error Handling

All API responses follow a consistent format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```
