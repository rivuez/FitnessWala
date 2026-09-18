// Key API endpoints that backend needs to implement:

// Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me

// User Management
PUT /api/users/profile

// Exercises
GET /api/exercises
GET /api/exercises/:id
POST /api/exercises/:id/complete
GET /api/exercises/completed
GET /api/exercises/stats

// Meals
GET /api/meals
GET /api/meals/:id
POST /api/meals/:id/complete
POST /api/meals

// Healing Activities
GET /api/healing
GET /api/healing/:id
POST /api/healing/:id/complete
POST /api/healing
GET /api/healing/completed
GET /api/healing/stats

// Communities
GET /api/communities
GET /api/communities/:id

// Posts
GET /api/posts
POST /api/posts

// Challenges
GET /api/challenges
GET /api/challenges/:id
POST /api/challenges/:id/join
POST /api/challenges