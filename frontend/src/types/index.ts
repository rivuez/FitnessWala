export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  exerciseStreak: number;
  lastExerciseDate?: string;
  longestExerciseStreak: number;
  healingStreak?: number;
  lastHealingDate?: string;
  longestHealingStreak?: number;
  mass?: number; // in kg
  height?: number; // in cm
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  _id: string;
  name: string;
  description: string;
  category: 'zen' | 'yoga' | 'calisthenics' | 'powerlifting' | 'cardio' | 'strength' | 'flexibility';
  equipment?: string[];
  injuryWarning?: string;
  instructions: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  calories: number;
  imageUrl?: string;
  isCompleted?: boolean;
  completedAt?: string;
}

export interface Meal {
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

export interface HealingActivity {
  _id: string;
  name: string;
  description: string;
  category: 'ayurvedic' | 'meditation' | 'breathing' | 'therapy' | 'wellness' | 'yoga';
  benefits: string;
  instructions: string;
  duration: number; // in minutes
  imageUrl?: string;
  isCompleted?: boolean;
  completedAt?: string;
}

export interface HealingActivityCompletion {
  _id: string;
  user: string;
  healingActivity: HealingActivity;
  duration: number;
  notes: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Community {
  _id: string;
  name: string;
  type: 'ayurvedic' | 'satvik' | 'yoga' | 'calisthenics' | 'powerlifting' | 'general';
  description: string;
  memberCount: number;
  imageUrl?: string;
}

export interface Post {
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

export interface Comment {
  _id: string;
  content: string;
  author: User;
  createdAt: string;
}

export interface Challenge {
  _id: string;
  title: string;
  description: string;
  type: 'exercise' | 'meal' | 'healing' | 'mixed';
  requirements: {
    exercises?: number;
    meals?: number;
    healingActivities?: number;
    duration?: number; // in days
  };
  participants: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  imageUrl?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 