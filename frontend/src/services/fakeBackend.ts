import { User, Exercise, Meal, HealingActivity, Community, Post, Challenge, AuthResponse, ApiResponse } from '../types';

// Mock data
const mockUsers: User[] = [
  {
    _id: '1',
    username: 'john_doe',
    email: 'john@example.com',
    firstName: 'John',
    lastName: 'Doe',
    exerciseStreak: 5,
    longestExerciseStreak: 12,
    lastExerciseDate: '2024-01-15',
    healingStreak: 3,
    longestHealingStreak: 7,
    lastHealingDate: '2024-01-15',
    mass: 75, // 75 kg
    height: 175, // 175 cm
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    _id: '2',
    username: 'jane_smith',
    email: 'jane@example.com',
    firstName: 'Jane',
    lastName: 'Smith',
    exerciseStreak: 3,
    longestExerciseStreak: 8,
    lastExerciseDate: '2024-01-14',
    healingStreak: 2,
    longestHealingStreak: 5,
    lastHealingDate: '2024-01-14',
    mass: 62, // 62 kg
    height: 165, // 165 cm
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-14T00:00:00Z',
  },
];

const mockExercises: Exercise[] = [
  {
    _id: '1',
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
    _id: '2',
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
    _id: '3',
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
    _id: '4',
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

const mockMeals: Meal[] = [
  {
    _id: '1',
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
    _id: '2',
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
    _id: '3',
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

const mockHealingActivities: HealingActivity[] = [
  {
    _id: '1',
    name: 'Abhyanga (Self Massage)',
    description: 'Traditional ayurvedic oil massage',
    category: 'ayurvedic',
    benefits: 'Improves circulation, relieves stress, nourishes skin, promotes sleep',
    instructions: 'Warm sesame oil, apply to entire body, massage in circular motions, let oil absorb for 20 minutes, take warm shower',
    duration: 30,
    imageUrl: 'https://images.unsplash.com/photo-1544161512-6ad1f9baa7b8?w=400',
    isCompleted: true,
    completedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '2',
    name: 'Pranayama',
    description: 'Breathing technique for energy and focus',
    category: 'breathing',
    benefits: 'Increases energy, improves focus, reduces anxiety, balances nervous system',
    instructions: 'Sit in comfortable position, close right nostril, inhale through left nostril, close left nostril, exhale through right nostril, repeat pattern',
    duration: 15,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    isCompleted: true,
    completedAt: '2024-01-14T08:00:00Z',
  },
  {
    _id: '3',
    name: 'Neti Pot',
    description: 'Nasal cleansing technique',
    category: 'therapy',
    benefits: 'Clears nasal passages, reduces allergies, improves breathing, sinus relief',
    instructions: 'Mix warm water with salt, fill neti pot, tilt head to side, pour solution through one nostril, let it flow out other nostril, repeat on other side',
    duration: 10,
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400',
    isCompleted: true,
    completedAt: '2024-01-13T15:30:00Z',
  },
  {
    _id: '4',
    name: 'Meditation',
    description: 'Mindfulness meditation for inner peace',
    category: 'meditation',
    benefits: 'Reduces stress, improves focus, promotes emotional well-being, enhances self-awareness',
    instructions: 'Find a quiet place, sit comfortably, close eyes, focus on breath, let thoughts pass without judgment, start with 5-10 minutes',
    duration: 20,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
  {
    _id: '5',
    name: 'Yoga Nidra',
    description: 'Deep relaxation technique',
    category: 'yoga',
    benefits: 'Deep relaxation, stress relief, improved sleep, mental clarity',
    instructions: 'Lie in savasana, follow guided meditation, scan body parts, maintain awareness between sleep and wakefulness',
    duration: 25,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
  },
];

const mockCommunities: Community[] = [
  {
    _id: '1',
    name: 'Ayurvedic Wellness',
    type: 'ayurvedic',
    description: 'Community focused on ayurvedic practices and natural healing',
    memberCount: 1250,
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
  },
  {
    _id: '2',
    name: 'Yoga Enthusiasts',
    type: 'yoga',
    description: 'Share yoga tips, poses, and mindfulness practices',
    memberCount: 2100,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
  {
    _id: '3',
    name: 'Calisthenics Warriors',
    type: 'calisthenics',
    description: 'Bodyweight training and street workout community',
    memberCount: 890,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  },
];

const mockPosts: Post[] = [
  {
    _id: '1',
    title: 'My 30-day yoga challenge journey',
    content: 'Just completed my first week of daily yoga practice. Feeling amazing!',
    author: mockUsers[0],
    community: mockCommunities[1],
    likes: ['2'],
    comments: [],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '2',
    title: 'Best ayurvedic morning routine',
    content: 'Here\'s my daily ayurvedic routine that changed my life...',
    author: mockUsers[1],
    community: mockCommunities[0],
    likes: ['1'],
    comments: [],
    createdAt: '2024-01-14T08:00:00Z',
    updatedAt: '2024-01-14T08:00:00Z',
  },
];

const mockChallenges: Challenge[] = [
  {
    _id: '1',
    title: '30-Day Wellness Challenge',
    description: 'Complete daily exercises, meals, and healing activities',
    type: 'mixed',
    requirements: {
      exercises: 30,
      meals: 30,
      healingActivities: 30,
      duration: 30,
    },
    participants: ['1', '2'],
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
  },
  {
    _id: '2',
    title: 'Zen Meditation Challenge',
    description: 'Daily meditation and breathing exercises',
    type: 'healing',
    requirements: {
      healingActivities: 21,
      duration: 21,
    },
    participants: ['1'],
    startDate: '2024-01-10T00:00:00Z',
    endDate: '2024-01-31T23:59:59Z',
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication
let currentUser: User | null = null;
let authToken: string | null = null;

export const fakeBackend = {
  // Auth APIs
  async register(userData: { username: string; email: string; password: string; firstName: string; lastName: string; mass?: number; height?: number }): Promise<ApiResponse<AuthResponse>> {
    await delay(1000);
    
    const existingUser = mockUsers.find(u => u.email === userData.email || u.username === userData.username);
    if (existingUser) {
      return { success: false, error: 'User already exists' };
    }

    const newUser: User = {
      _id: (mockUsers.length + 1).toString(),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      exerciseStreak: 0,
      longestExerciseStreak: 0,
      mass: userData.mass,
      height: userData.height,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    currentUser = newUser;
    authToken = 'fake-jwt-token-' + Date.now();

    return {
      success: true,
      data: { user: newUser, token: authToken }
    };
  },

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    await delay(1000);
    
    const user = mockUsers.find(u => u.email === credentials.email);
    if (!user) {
      return { success: false, error: 'Invalid credentials' };
    }

    currentUser = user;
    authToken = 'fake-jwt-token-' + Date.now();

    return {
      success: true,
      data: { user, token: authToken }
    };
  },

  async logout(): Promise<ApiResponse<null>> {
    await delay(500);
    currentUser = null;
    authToken = null;
    return { success: true };
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    await delay(500);
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }
    return { success: true, data: currentUser };
  },

  // User APIs
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    await delay(1000);
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const updatedUser = { ...currentUser, ...userData, updatedAt: new Date().toISOString() };
    const index = mockUsers.findIndex(u => u._id === currentUser!._id);
    mockUsers[index] = updatedUser;
    currentUser = updatedUser;

    return { success: true, data: updatedUser };
  },

  // Exercise APIs
  async getExercises(category?: string): Promise<ApiResponse<Exercise[]>> {
    await delay(800);
    let exercises = [...mockExercises];
    if (category) {
      exercises = exercises.filter(e => e.category === category);
    }
    return { success: true, data: exercises };
  },

  async getExercise(id: string): Promise<ApiResponse<Exercise>> {
    await delay(500);
    const exercise = mockExercises.find(e => e._id === id);
    if (!exercise) {
      return { success: false, error: 'Exercise not found' };
    }
    return { success: true, data: exercise };
  },

  async markExerciseComplete(exerciseId: string): Promise<ApiResponse<User>> {
    await delay(1000);
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const exercise = mockExercises.find(e => e._id === exerciseId);
    if (!exercise) {
      return { success: false, error: 'Exercise not found' };
    }

    exercise.isCompleted = true;
    exercise.completedAt = new Date().toISOString();

    // Update user streak
    const today = new Date().toDateString();
    const lastExerciseDate = currentUser.lastExerciseDate ? new Date(currentUser.lastExerciseDate).toDateString() : null;
    
    if (lastExerciseDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();
      
      if (lastExerciseDate === yesterdayString) {
        currentUser.exerciseStreak += 1;
      } else {
        currentUser.exerciseStreak = 1;
      }
      
      currentUser.lastExerciseDate = new Date().toISOString();
      if (currentUser.exerciseStreak > currentUser.longestExerciseStreak) {
        currentUser.longestExerciseStreak = currentUser.exerciseStreak;
      }
    }

    const index = mockUsers.findIndex(u => u._id === currentUser!._id);
    mockUsers[index] = currentUser;

    return { success: true, data: currentUser };
  },

  async getCompletedExercises(): Promise<ApiResponse<Exercise[]>> {
    await delay(800);
    const completedExercises = mockExercises.filter(exercise => exercise.isCompleted);
    return { success: true, data: completedExercises };
  },

  async getExerciseStats(): Promise<ApiResponse<{
    totalCompleted: number;
    thisWeekCompleted: number;
    totalCaloriesBurned: number;
    thisWeekCalories: number;
    categoryBreakdown: Record<string, number>;
    averageDuration: number;
  }>> {
    await delay(600);
    
    const completedExercises = mockExercises.filter(exercise => exercise.isCompleted);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeekExercises = completedExercises.filter(exercise => 
      exercise.completedAt && new Date(exercise.completedAt) >= oneWeekAgo
    );
    
    const categoryBreakdown: Record<string, number> = {};
    completedExercises.forEach(exercise => {
      categoryBreakdown[exercise.category] = (categoryBreakdown[exercise.category] || 0) + 1;
    });
    
    const totalCaloriesBurned = completedExercises.reduce((sum, exercise) => sum + exercise.calories, 0);
    const thisWeekCalories = thisWeekExercises.reduce((sum, exercise) => sum + exercise.calories, 0);
    const averageDuration = completedExercises.length > 0 
      ? completedExercises.reduce((sum, exercise) => sum + exercise.duration, 0) / completedExercises.length 
      : 0;
    
    return {
      success: true,
      data: {
        totalCompleted: completedExercises.length,
        thisWeekCompleted: thisWeekExercises.length,
        totalCaloriesBurned,
        thisWeekCalories,
        categoryBreakdown,
        averageDuration: Math.round(averageDuration)
      }
    };
  },

  // Meal APIs
  async getMeals(category?: string): Promise<ApiResponse<Meal[]>> {
    await delay(800);
    let meals = [...mockMeals];
    if (category) {
      meals = meals.filter(m => m.category === category);
    }
    return { success: true, data: meals };
  },

  async getMeal(id: string): Promise<ApiResponse<Meal>> {
    await delay(500);
    const meal = mockMeals.find(m => m._id === id);
    if (!meal) {
      return { success: false, error: 'Meal not found' };
    }
    return { success: true, data: meal };
  },

  async markMealComplete(mealId: string): Promise<ApiResponse<Meal>> {
    await delay(1000);
    const meal = mockMeals.find(m => m._id === mealId);
    if (!meal) {
      return { success: false, error: 'Meal not found' };
    }

    meal.isCompleted = true;
    meal.completedAt = new Date().toISOString();
    return { success: true, data: meal };
  },

  async createMeal(mealData: Omit<Meal, '_id' | 'isCompleted' | 'completedAt'>): Promise<ApiResponse<Meal>> {
    await delay(1000);
    
    const newMeal: Meal = {
      _id: Date.now().toString(),
      ...mealData,
      isCompleted: false,
      completedAt: undefined
    };
    
    mockMeals.push(newMeal);
    
    return { success: true, data: newMeal };
  },

  // Healing Activity APIs
  async getHealingActivities(category?: string): Promise<ApiResponse<HealingActivity[]>> {
    await delay(800);
    let activities = [...mockHealingActivities];
    if (category) {
      activities = activities.filter(h => h.category === category);
    }
    return { success: true, data: activities };
  },

  async getHealingActivity(id: string): Promise<ApiResponse<HealingActivity>> {
    await delay(500);
    const activity = mockHealingActivities.find(h => h._id === id);
    if (!activity) {
      return { success: false, error: 'Healing activity not found' };
    }
    return { success: true, data: activity };
  },

  async markHealingActivityComplete(activityId: string): Promise<ApiResponse<User>> {
    await delay(1000);
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const activity = mockHealingActivities.find(h => h._id === activityId);
    if (!activity) {
      return { success: false, error: 'Healing activity not found' };
    }

    activity.isCompleted = true;
    activity.completedAt = new Date().toISOString();

    // Update user healing streak (similar to exercise streak)
    const today = new Date().toDateString();
    const lastHealingDate = currentUser.lastHealingDate ? new Date(currentUser.lastHealingDate).toDateString() : null;
    
    if (lastHealingDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayString = yesterday.toDateString();
      
      if (lastHealingDate === yesterdayString) {
        currentUser.healingStreak = (currentUser.healingStreak || 0) + 1;
      } else {
        currentUser.healingStreak = 1;
      }
      
      currentUser.lastHealingDate = new Date().toISOString();
      if ((currentUser.healingStreak || 0) > (currentUser.longestHealingStreak || 0)) {
        currentUser.longestHealingStreak = currentUser.healingStreak;
      }
    }

    const index = mockUsers.findIndex(u => u._id === currentUser!._id);
    mockUsers[index] = currentUser;

    return { success: true, data: currentUser };
  },

  async createHealingActivity(activityData: Omit<HealingActivity, '_id' | 'isCompleted' | 'completedAt'>): Promise<ApiResponse<HealingActivity>> {
    await delay(1000);
    
    const newActivity: HealingActivity = {
      _id: Date.now().toString(),
      ...activityData,
      isCompleted: false,
      completedAt: undefined
    };
    
    mockHealingActivities.push(newActivity);
    
    return { success: true, data: newActivity };
  },

  async getCompletedHealingActivities(): Promise<ApiResponse<HealingActivity[]>> {
    await delay(800);
    const completedActivities = mockHealingActivities.filter(activity => activity.isCompleted);
    return { success: true, data: completedActivities };
  },

  async getHealingStats(): Promise<ApiResponse<{
    totalCompleted: number;
    thisWeekCompleted: number;
    totalDuration: number;
    thisWeekDuration: number;
    categoryBreakdown: Record<string, number>;
    averageDuration: number;
  }>> {
    await delay(600);
    
    const completedActivities = mockHealingActivities.filter(activity => activity.isCompleted);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const thisWeekActivities = completedActivities.filter(activity => 
      activity.completedAt && new Date(activity.completedAt) >= oneWeekAgo
    );
    
    const categoryBreakdown: Record<string, number> = {};
    completedActivities.forEach(activity => {
      categoryBreakdown[activity.category] = (categoryBreakdown[activity.category] || 0) + 1;
    });
    
    const totalDuration = completedActivities.reduce((sum, activity) => sum + activity.duration, 0);
    const thisWeekDuration = thisWeekActivities.reduce((sum, activity) => sum + activity.duration, 0);
    const averageDuration = completedActivities.length > 0 
      ? completedActivities.reduce((sum, activity) => sum + activity.duration, 0) / completedActivities.length 
      : 0;
    
    return {
      success: true,
      data: {
        totalCompleted: completedActivities.length,
        thisWeekCompleted: thisWeekActivities.length,
        totalDuration,
        thisWeekDuration,
        categoryBreakdown,
        averageDuration: Math.round(averageDuration)
      }
    };
  },

  // Community APIs
  async getCommunities(): Promise<ApiResponse<Community[]>> {
    await delay(800);
    return { success: true, data: mockCommunities };
  },

  async getCommunity(id: string): Promise<ApiResponse<Community>> {
    await delay(500);
    const community = mockCommunities.find(c => c._id === id);
    if (!community) {
      return { success: false, error: 'Community not found' };
    }
    return { success: true, data: community };
  },

  // Post APIs
  async getPosts(communityId?: string): Promise<ApiResponse<Post[]>> {
    await delay(800);
    let posts = [...mockPosts];
    if (communityId) {
      posts = posts.filter(p => p.community._id === communityId);
    }
    return { success: true, data: posts };
  },

  async createPost(postData: { title: string; content: string; communityId: string }): Promise<ApiResponse<Post>> {
    await delay(1000);
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const community = mockCommunities.find(c => c._id === postData.communityId);
    if (!community) {
      return { success: false, error: 'Community not found' };
    }

    const newPost: Post = {
      _id: (mockPosts.length + 1).toString(),
      title: postData.title,
      content: postData.content,
      author: currentUser,
      community,
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockPosts.push(newPost);
    return { success: true, data: newPost };
  },

  // Challenge APIs
  async getChallenges(): Promise<ApiResponse<Challenge[]>> {
    await delay(800);
    return { success: true, data: mockChallenges };
  },

  async getChallenge(id: string): Promise<ApiResponse<Challenge>> {
    await delay(500);
    const challenge = mockChallenges.find(c => c._id === id);
    if (!challenge) {
      return { success: false, error: 'Challenge not found' };
    }
    return { success: true, data: challenge };
  },

  async joinChallenge(challengeId: string): Promise<ApiResponse<Challenge>> {
    await delay(1000);
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const challenge = mockChallenges.find(c => c._id === challengeId);
    if (!challenge) {
      return { success: false, error: 'Challenge not found' };
    }

    if (challenge.participants.includes(currentUser._id)) {
      return { success: false, error: 'Already joined this challenge' };
    }

    challenge.participants.push(currentUser._id);
    return { success: true, data: challenge };
  },

  async createChallenge(challengeData: Omit<Challenge, '_id' | 'participants'>): Promise<ApiResponse<Challenge>> {
    await delay(1000);
    if (!currentUser) {
      return { success: false, error: 'Not authenticated' };
    }

    const newChallenge: Challenge = {
      _id: (mockChallenges.length + 1).toString(),
      ...challengeData,
      participants: [currentUser._id],
    };

    mockChallenges.push(newChallenge);
    return { success: true, data: newChallenge };
  },
}; 