# FitnessWala 2.0 - Complete Fitness Application

A comprehensive React-based fitness application with user management, exercise tracking, meal planning, healing activities, community features, and challenges.

## 🚀 Features

### 1. **User Management**
- User registration and authentication
- Profile management with streak tracking
- Exercise streak tracking with longest streak records
- JWT-based authentication

### 2. **Exercise Management**
- Comprehensive exercise library with categories
- Filter by category, difficulty, and search
- Exercise completion tracking
- Injury warnings and safety information
- Categories: Yoga, Zen, Calisthenics, Powerlifting, Cardio, Strength, Flexibility

### 3. **Meal Management**
- Healthy meal library with nutritional information
- Satvik and Ayurvedic meal options
- Meal completion tracking
- Nutritional breakdown (calories, protein, carbs, fat, fiber)

### 4. **Healing Zone (Ayurveda)**
- Dedicated healing activities section
- Ayurvedic remedies and therapies
- Wellness-focused activities
- Categories: Ayurvedic, Meditation, Breathing, Therapy, Wellness

### 5. **Community & Social Features**
- Multiple community types
- Post creation and sharing
- Community-based discussions
- Filtering by community type

### 6. **Challenges**
- Fitness challenges with goals
- Progress tracking
- Community participation
- Achievement system

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context API
- **UI Components**: Heroicons, Headless UI
- **Notifications**: React Hot Toast
- **Animations**: Framer Motion

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 📱 Usage

### Authentication
- Register a new account or login with existing credentials
- All features require authentication
- User profile shows current streak and statistics

### Dashboard
- Overview of user statistics
- Quick access to exercises, meals, and healing activities
- Recent activities and active challenges
- Streak tracking and achievements

### Exercises
- Browse exercise library with filtering options
- Search by name or description
- Filter by category and difficulty level
- Mark exercises as complete to maintain streak

## 🔌 API Documentation

The application uses a comprehensive fake backend with the following APIs:

### Authentication APIs

#### Register User
```typescript
POST /api/auth/register
Body: {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
Response: {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}
```

#### Login User
```typescript
POST /api/auth/login
Body: {
  email: string;
  password: string;
}
Response: {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  error?: string;
}
```

#### Logout User
```typescript
POST /api/auth/logout
Response: {
  success: boolean;
}
```

#### Get Current User
```typescript
GET /api/auth/me
Response: {
  success: boolean;
  data?: User;
  error?: string;
}
```

### User Management APIs

#### Update Profile
```typescript
PUT /api/users/profile
Body: Partial<User>
Response: {
  success: boolean;
  data?: User;
  error?: string;
}
```

### Exercise APIs

#### Get All Exercises
```typescript
GET /api/exercises?category=string
Response: {
  success: boolean;
  data?: Exercise[];
  error?: string;
}
```

#### Get Single Exercise
```typescript
GET /api/exercises/:id
Response: {
  success: boolean;
  data?: Exercise;
  error?: string;
}
```

#### Mark Exercise Complete
```typescript
POST /api/exercises/:id/complete
Response: {
  success: boolean;
  data?: User; // Updated user with new streak
  error?: string;
}
```

### Meal APIs

#### Get All Meals
```typescript
GET /api/meals?category=string
Response: {
  success: boolean;
  data?: Meal[];
  error?: string;
}
```

#### Get Single Meal
```typescript
GET /api/meals/:id
Response: {
  success: boolean;
  data?: Meal;
  error?: string;
}
```

#### Mark Meal Complete
```typescript
POST /api/meals/:id/complete
Response: {
  success: boolean;
  data?: Meal;
  error?: string;
}
```

### Healing Activity APIs

#### Get All Healing Activities
```typescript
GET /api/healing?category=string
Response: {
  success: boolean;
  data?: HealingActivity[];
  error?: string;
}
```

#### Get Single Healing Activity
```typescript
GET /api/healing/:id
Response: {
  success: boolean;
  data?: HealingActivity;
  error?: string;
}
```

#### Mark Healing Activity Complete
```typescript
POST /api/healing/:id/complete
Response: {
  success: boolean;
  data?: HealingActivity;
  error?: string;
}
```

### Community APIs

#### Get All Communities
```typescript
GET /api/communities
Response: {
  success: boolean;
  data?: Community[];
  error?: string;
}
```

#### Get Single Community
```typescript
GET /api/communities/:id
Response: {
  success: boolean;
  data?: Community;
  error?: string;
}
```

### Post APIs

#### Get All Posts
```typescript
GET /api/posts?communityId=string
Response: {
  success: boolean;
  data?: Post[];
  error?: string;
}
```

#### Create Post
```typescript
POST /api/posts
Body: {
  title: string;
  content: string;
  communityId: string;
}
Response: {
  success: boolean;
  data?: Post;
  error?: string;
}
```

### Challenge APIs

#### Get All Challenges
```typescript
GET /api/challenges
Response: {
  success: boolean;
  data?: Challenge[];
  error?: string;
}
```

#### Get Single Challenge
```typescript
GET /api/challenges/:id
Response: {
  success: boolean;
  data?: Challenge;
  error?: string;
}
```

#### Join Challenge
```typescript
POST /api/challenges/:id/join
Response: {
  success: boolean;
  data?: Challenge;
  error?: string;
}
```

#### Create Challenge
```typescript
POST /api/challenges
Body: {
  title: string;
  description: string;
  type: 'exercise' | 'meal' | 'healing' | 'mixed';
  requirements: {
    exercises?: number;
    meals?: number;
    healingActivities?: number;
    duration?: number;
  };
  startDate: string;
  endDate: string;
  imageUrl?: string;
}
Response: {
  success: boolean;
  data?: Challenge;
  error?: string;
}
```

## 📊 Data Models

### User
```typescript
interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  exerciseStreak: number;
  lastExerciseDate?: string;
  longestExerciseStreak: number;
  createdAt: string;
  updatedAt: string;
}
```

### Exercise
```typescript
interface Exercise {
  _id: string;
  name: string;
  description: string;
  category: 'zen' | 'yoga' | 'calisthenics' | 'powerlifting' | 'cardio' | 'strength' | 'flexibility';
  equipment?: string[];
  injuryWarning?: string;
  instructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  calories: number;
  imageUrl?: string;
  isCompleted?: boolean;
  completedAt?: string;
}
```

### Meal
```typescript
interface Meal {
  _id: string;
  name: string;
  description: string;
  category: 'satvik' | 'ayurvedic' | 'regular' | 'breakfast' | 'lunch' | 'dinner' | 'snack';
  ingredients: string[];
  instructions: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  imageUrl?: string;
  isCompleted?: boolean;
  completedAt?: string;
}
```

### HealingActivity
```typescript
interface HealingActivity {
  _id: string;
  name: string;
  description: string;
  category: 'ayurvedic' | 'meditation' | 'breathing' | 'therapy' | 'wellness';
  benefits: string[];
  instructions: string[];
  duration: number;
  imageUrl?: string;
  isCompleted?: boolean;
  completedAt?: string;
}
```

### Community
```typescript
interface Community {
  _id: string;
  name: string;
  type: 'ayurvedic' | 'satvik' | 'yoga' | 'calisthenics' | 'powerlifting' | 'general';
  description: string;
  memberCount: number;
  imageUrl?: string;
}
```

### Post
```typescript
interface Post {
  _id: string;
  title: string;
  content: string;
  author: User;
  community: Community;
  likes: string[];
  comments: Comment[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Challenge
```typescript
interface Challenge {
  _id: string;
  title: string;
  description: string;
  type: 'exercise' | 'meal' | 'healing' | 'mixed';
  requirements: {
    exercises?: number;
    meals?: number;
    healingActivities?: number;
    duration?: number;
  };
  participants: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  imageUrl?: string;
}
```

## 🎨 Design System

The application uses a consistent design system with:

- **Primary Colors**: Blue gradient (#0ea5e9 to #0284c7)
- **Secondary Colors**: Purple gradient (#d946ef to #c026d3)
- **Typography**: Inter font family
- **Components**: Custom Tailwind CSS classes
- **Icons**: Heroicons
- **Animations**: Framer Motion

## 🔒 Security Features

- JWT-based authentication
- Protected routes
- Form validation
- Error handling
- Secure password handling

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Netlify/Vercel
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@fitnesswala.com or create an issue in the repository.

---

**Note**: This application currently uses a fake backend for demonstration purposes. For production use, replace the fake backend with a real Express.js/Node.js backend with MongoDB integration.
