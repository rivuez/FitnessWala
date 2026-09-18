import axios from 'axios';
import { 
  User, 
  Exercise, 
  Meal, 
  HealingActivity, 
  HealingActivityCompletion,
  Community, 
  Post, 
  Challenge, 
  AuthResponse, 
  ApiResponse 
} from '../types';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the base URL for debugging
console.log('API Base URL:', process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api');

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    console.log('Request interceptor - Token found:', !!token);
    console.log('Request URL:', config.url);
    if (token) {
      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        if (payload.exp && payload.exp < currentTime) {
          console.log('Token is expired, removing from localStorage');
          localStorage.removeItem('authToken');
          // Don't redirect automatically to prevent loops
          // window.location.href = '/login';
          return Promise.reject(new Error('Token expired'));
        }
      } catch (error) {
        console.log('Error parsing token:', error);
      }
      
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Authorization header added:', config.headers.Authorization);
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - just remove token, don't redirect
      console.log('401 Unauthorized - removing token');
      localStorage.removeItem('authToken');
      // Don't redirect automatically to prevent loops
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
const handleResponse = <T>(response: any): ApiResponse<T> => {
  return response.data;
};

// Helper function to handle API errors
const handleError = (error: any): ApiResponse<any> => {
  return {
    success: false,
    error: error.response?.data?.error || error.message || 'An error occurred',
  };
};

export const apiService = {
  // Authentication APIs
  async register(userData: { 
    username: string; 
    email: string; 
    password: string; 
    firstName: string; 
    lastName: string; 
    mass?: number; 
    height?: number 
  }): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post('/auth/register', userData);
      return handleResponse<AuthResponse>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async login(credentials: { email: string; password: string }): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await api.post('/auth/login', credentials);
      return handleResponse<AuthResponse>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async logout(): Promise<ApiResponse<null>> {
    try {
      const response = await api.post('/auth/logout');
      return handleResponse<null>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      const response = await api.get('/auth/me');
      return handleResponse<User>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // User Management APIs
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    try {
      const response = await api.put('/users/profile', userData);
      return handleResponse<User>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Exercise APIs
  async getExercises(category?: string): Promise<ApiResponse<Exercise[]>> {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/exercises', { params });
      return handleResponse<Exercise[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async getExercise(id: string): Promise<ApiResponse<Exercise>> {
    try {
      const response = await api.get(`/exercises/${id}`);
      return handleResponse<Exercise>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async markExerciseComplete(exerciseId: string): Promise<ApiResponse<User>> {
    try {
      const response = await api.post(`/exercises/${exerciseId}/complete`);
      return handleResponse<User>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async getCompletedExercises(): Promise<ApiResponse<Exercise[]>> {
    try {
      const response = await api.get('/exercises/completed');
      return handleResponse<Exercise[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async getExerciseStats(): Promise<ApiResponse<{
    totalCompleted: number;
    thisWeekCompleted: number;
    totalCaloriesBurned: number;
    thisWeekCalories: number;
    categoryBreakdown: Record<string, number>;
    averageDuration: number;
  }>> {
    try {
      const response = await api.get('/exercises/stats');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Meal APIs
  async getMeals(category?: string): Promise<ApiResponse<Meal[]>> {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/meals', { params });
      return handleResponse<Meal[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async getMeal(id: string): Promise<ApiResponse<Meal>> {
    try {
      const response = await api.get(`/meals/${id}`);
      return handleResponse<Meal>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async markMealComplete(mealId: string): Promise<ApiResponse<Meal>> {
    try {
      const response = await api.post(`/meals/${mealId}/complete`);
      return handleResponse<Meal>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async createMeal(mealData: Omit<Meal, '_id' | 'isCompleted' | 'completedAt'>): Promise<ApiResponse<Meal>> {
    try {
      const response = await api.post('/meals', mealData);
      return handleResponse<Meal>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Healing Activity APIs
  async getHealingActivities(category?: string): Promise<ApiResponse<HealingActivity[]>> {
    try {
      const params = category ? { category } : {};
      const response = await api.get('/healing', { params });
      return handleResponse<HealingActivity[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async getHealingActivity(id: string): Promise<ApiResponse<HealingActivity>> {
    try {
      const response = await api.get(`/healing/${id}`);
      return handleResponse<HealingActivity>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async markHealingActivityComplete(activityId: string): Promise<ApiResponse<User>> {
    try {
      const response = await api.post(`/healing/${activityId}/complete`);
      return handleResponse<User>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async createHealingActivity(activityData: Omit<HealingActivity, '_id' | 'isCompleted' | 'completedAt'>): Promise<ApiResponse<HealingActivity>> {
    try {
      const response = await api.post('/healing', activityData);
      return handleResponse<HealingActivity>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async getCompletedHealingActivities(): Promise<ApiResponse<HealingActivity[]>> {
    try {
      console.log('Making API call to /healing/completed');
      const response = await api.get('/healing/completed');
      console.log('API response for /healing/completed:', response.data);
      
      // Transform the response data to match the expected HealingActivity structure
      if (response.data.success && response.data.data) {
        const transformedData = response.data.data.map((completionRecord: HealingActivityCompletion) => ({
          _id: completionRecord.healingActivity._id,
          name: completionRecord.healingActivity.name,
          description: completionRecord.healingActivity.description,
          category: completionRecord.healingActivity.category,
          benefits: completionRecord.healingActivity.benefits,
          instructions: completionRecord.healingActivity.instructions,
          duration: completionRecord.healingActivity.duration,
          imageUrl: completionRecord.healingActivity.imageUrl,
          isCompleted: true,
          completedAt: completionRecord.completedAt,
        }));
        
        console.log('Transformed healing activities data:', transformedData);
        
        return {
          success: true,
          data: transformedData
        };
      }
      
      return handleResponse<HealingActivity[]>(response);
    } catch (error) {
      console.error('API error for /healing/completed:', error);
      return handleError(error);
    }
  },

  async getHealingStats(): Promise<ApiResponse<{
    totalCompleted: number;
    thisWeekCompleted: number;
    totalDuration: number;
    thisWeekDuration: number;
    categoryBreakdown: Record<string, number>;
    averageDuration: number;
  }>> {
    try {
      const response = await api.get('/healing/stats');
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Community APIs
  async getCommunities(): Promise<ApiResponse<Community[]>> {
    try {
      const response = await api.get('/communities');
      return handleResponse<Community[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async getCommunity(id: string): Promise<ApiResponse<Community>> {
    try {
      const response = await api.get(`/communities/${id}`);
      return handleResponse<Community>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Post APIs
  async getPosts(communityId?: string): Promise<ApiResponse<Post[]>> {
    try {
      const params = communityId ? { communityId } : {};
      const response = await api.get('/posts', { params });
      return handleResponse<Post[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async createPost(postData: { title: string; content: string; communityId: string }): Promise<ApiResponse<Post>> {
    try {
      const response = await api.post('/posts', postData);
      return handleResponse<Post>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  // Challenge APIs
  async getChallenges(): Promise<ApiResponse<Challenge[]>> {
    try {
      const response = await api.get('/challenges');
      return handleResponse<Challenge[]>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async getChallenge(id: string): Promise<ApiResponse<Challenge>> {
    try {
      const response = await api.get(`/challenges/${id}`);
      return handleResponse<Challenge>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async joinChallenge(challengeId: string): Promise<ApiResponse<Challenge>> {
    try {
      const response = await api.post(`/challenges/${challengeId}/join`);
      return handleResponse<Challenge>(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async createChallenge(challengeData: Omit<Challenge, '_id' | 'participants'>): Promise<ApiResponse<Challenge>> {
    try {
      const response = await api.post('/challenges', challengeData);
      return handleResponse<Challenge>(response);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default apiService; 