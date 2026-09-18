import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { fakeBackend } from '../../services/fakeBackend';
import { Exercise, Meal, HealingActivity, Challenge } from '../../types';
import { getExerciseImageUrl, getHealingImageUrl, getMealImageUrl } from '../../utils/imageUtils';
import { 
  FireIcon, 
  ClockIcon, 
  HeartIcon, 
  TrophyIcon,
  CalendarIcon,
  ChartBarIcon,
  PlayIcon,
  CheckCircleIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';

const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [recentExercises, setRecentExercises] = useState<Exercise[]>([]);
  const [recentMeals, setRecentMeals] = useState<Meal[]>([]);
  const [recentHealing, setRecentHealing] = useState<HealingActivity[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<Challenge[]>([]);
  const [exerciseStats, setExerciseStats] = useState<{
    totalCompleted: number;
    thisWeekCompleted: number;
    totalCaloriesBurned: number;
    thisWeekCalories: number;
    categoryBreakdown: Record<string, number>;
    averageDuration: number;
  } | null>(null);
  const [healingStats, setHealingStats] = useState<{
    totalCompleted: number;
    thisWeekCompleted: number;
    totalDuration: number;
    thisWeekDuration: number;
    categoryBreakdown: Record<string, number>;
    averageDuration: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'fallback' | 'error'>('loading');

  useEffect(() => {
    loadDashboardData();
    // Expose global refresh function
    (window as any).refreshDashboardData = loadDashboardData;
    return () => {
      (window as any).refreshDashboardData = null;
    };
  }, []);

  // Debug effect for healing activities
  useEffect(() => {
    console.log('Recent healing activities state updated:', recentHealing);
  }, [recentHealing]);

  // Debug effect for auth token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Dashboard - Auth token check:', !!token);
    if (token) {
      console.log('Dashboard - Token value:', token.substring(0, 20) + '...');
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      console.log('Starting to load dashboard data...');
      
      const [exercisesRes, mealsRes, healingRes, challengesRes, exerciseStatsRes, completedExercisesRes, healingStatsRes, completedHealingRes] = await Promise.all([
        apiService.getExercises(),
        apiService.getMeals(),
        apiService.getHealingActivities(),
        apiService.getChallenges(),
        apiService.getExerciseStats(),
        apiService.getCompletedExercises(),
        apiService.getHealingStats(),
        apiService.getCompletedHealingActivities(),
      ]);

      if (exercisesRes.success) {
        setRecentExercises(exercisesRes.data?.slice(0, 3) || []);
      }
      if (mealsRes.success) {
        setRecentMeals(mealsRes.data?.slice(0, 3) || []);
      }
      if (healingRes.success) {
        setRecentHealing(healingRes.data?.slice(0, 3) || []);
      }
      if (challengesRes.success) {
        setActiveChallenges(challengesRes.data?.filter((c: Challenge) => c.isActive) || []);
      }
      if (exerciseStatsRes.success) {
        setExerciseStats(exerciseStatsRes.data || null);
      }
      if (healingStatsRes.success) {
        setHealingStats(healingStatsRes.data || null);
      }
      if (completedExercisesRes.success) {
        // Show recent completed exercises instead of all exercises
        const recentCompleted = completedExercisesRes.data
          ?.sort((a: Exercise, b: Exercise) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
          .slice(0, 3) || [];
        setRecentExercises(recentCompleted);
      }
      if (completedHealingRes.success) {
        // Show recent completed healing activities instead of all activities
        console.log('Completed healing activities response:', completedHealingRes);
        const recentCompleted = completedHealingRes.data
          ?.sort((a: HealingActivity, b: HealingActivity) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
          .slice(0, 3) || [];
        console.log('Recent completed healing activities:', recentCompleted);
        setRecentHealing(recentCompleted);
        setApiStatus('success');
      } else {
        console.error('Failed to get completed healing activities:', completedHealingRes.error);
        // Fallback: try to get all healing activities and filter completed ones
        if (healingRes.success && healingRes.data) {
          const completedFromAll = healingRes.data
            .filter((activity: HealingActivity) => activity.isCompleted)
            .sort((a: HealingActivity, b: HealingActivity) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
            .slice(0, 3);
          console.log('Fallback: completed healing activities from all activities:', completedFromAll);
          setRecentHealing(completedFromAll);
        } else {
          // Final fallback: use fake backend data
          console.log('Using fake backend as final fallback for healing activities');
          try {
            const fakeHealingRes = await fakeBackend.getCompletedHealingActivities();
            if (fakeHealingRes.success && fakeHealingRes.data) {
              const fakeCompleted = fakeHealingRes.data
                .sort((a: HealingActivity, b: HealingActivity) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime())
                .slice(0, 3);
              console.log('Fake backend healing activities:', fakeCompleted);
              setRecentHealing(fakeCompleted);
              setApiStatus('fallback');
            }
          } catch (fakeError) {
            console.error('Fake backend also failed:', fakeError);
          }
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setApiStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '💪';
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      yoga: 'bg-purple-100 text-purple-800',
      zen: 'bg-blue-100 text-blue-800',
      calisthenics: 'bg-green-100 text-green-800',
      powerlifting: 'bg-red-100 text-red-800',
      satvik: 'bg-yellow-100 text-yellow-800',
      ayurvedic: 'bg-orange-100 text-orange-800',
      regular: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const calculateBMI = (mass: number, height: number): { bmi: number; category: string; color: string } => {
    const heightInMeters = height / 100;
    const bmi = mass / (heightInMeters * heightInMeters);
    
    let category: string;
    let color: string;
    
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-600';
    } else if (bmi < 25) {
      category = 'Normal';
      color = 'text-green-600';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-orange-600';
    } else {
      category = 'Obese';
      color = 'text-red-600';
    }
    
    return { bmi: Math.round(bmi * 10) / 10, category, color };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.firstName}! {getStreakEmoji(user?.exerciseStreak || 0)}
              </h1>
              <p className="mt-2 text-gray-600">
                Keep up the great work on your fitness journey
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const token = localStorage.getItem('authToken');
                    console.log('Manual token check:', !!token);
                    if (token) {
                      console.log('Token:', token.substring(0, 50) + '...');
                    }
                    apiService.getCurrentUser().then(res => {
                      console.log('Manual auth check result:', res);
                    }).catch(err => {
                      console.error('Manual auth check error:', err);
                    });
                  }}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-xs mt-2"
                >
                  Check Auth
                </button>
                <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs mt-2">
                  {authLoading ? 'Loading...' : user ? 'Logged In' : 'Not Logged In'}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FireIcon className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Current Streak</p>
                <p className="text-lg font-bold text-gray-900">{user?.exerciseStreak || 0} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrophyIcon className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Longest Streak</p>
                <p className="text-lg font-bold text-gray-900">{user?.longestExerciseStreak || 0} days</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">This Week</p>
                <p className="text-lg font-bold text-gray-900">{exerciseStats?.thisWeekCompleted || 0} exercises</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HeartIcon className="h-6 w-6 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Calories Burned</p>
                <p className="text-lg font-bold text-gray-900">{exerciseStats?.thisWeekCalories || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <HeartIcon className="h-6 w-6 text-pink-500" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">Healing Streak</p>
                <p className="text-lg font-bold text-gray-900">{user?.healingStreak || 0} days</p>
              </div>
            </div>
          </div>

          {/* BMI Widget */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ScaleIcon className="h-6 w-6 text-indigo-500" />
              </div>
              <div className="ml-3">
                <p className="text-xs font-medium text-gray-500">BMI</p>
                {user?.mass && user?.height ? (
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {calculateBMI(user.mass, user.height).bmi}
                    </p>
                    <p className={`text-xs font-medium ${calculateBMI(user.mass, user.height).color}`}>
                      {calculateBMI(user.mass, user.height).category}
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">Not set</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BMI Info Section */}
        {user?.mass && user?.height && (
          <div className="mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-900">BMI Information</h3>
                <ScaleIcon className="h-5 w-5 text-indigo-500" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Your BMI</p>
                  <p className="text-xl font-bold text-gray-900">
                    {calculateBMI(user.mass, user.height).bmi}
                  </p>
                  <p className={`text-xs font-medium ${calculateBMI(user.mass, user.height).color}`}>
                    {calculateBMI(user.mass, user.height).category}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Mass</p>
                  <p className="text-lg font-bold text-gray-900">{user.mass} kg</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Height</p>
                  <p className="text-lg font-bold text-gray-900">{user.height} cm</p>
                </div>
              </div>
              <div className="mt-3 p-2 bg-gray-50 rounded text-center">
                <p className="text-xs text-gray-600">
                  <strong>BMI Categories:</strong> Underweight (&lt;18.5) • Normal (18.5-24.9) • Overweight (25-29.9) • Obese (≥30)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Additional Exercise Stats */}
        {exerciseStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-500">Total Completed</p>
                  <p className="text-base font-bold text-gray-900">{exerciseStats.totalCompleted} exercises</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-5 w-5 text-purple-500" />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-500">Avg Duration</p>
                  <p className="text-base font-bold text-gray-900">{exerciseStats.averageDuration} min</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-5 w-5 text-indigo-500" />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-500">Last Exercise</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.lastExerciseDate ? new Date(user.lastExerciseDate).toLocaleDateString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FireIcon className="h-5 w-5 text-orange-500" />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-500">Total Calories</p>
                  <p className="text-base font-bold text-gray-900">{exerciseStats.totalCaloriesBurned}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Healing Stats */}
        {healingStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <TrophyIcon className="h-5 w-5 text-yellow-500" />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-500">Longest Healing</p>
                  <p className="text-base font-bold text-gray-900">{user?.longestHealingStreak || 0} days</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-500">This Week</p>
                  <p className="text-base font-bold text-gray-900">{healingStats.thisWeekCompleted} activities</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-5 w-5 text-purple-500" />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-500">Total Time</p>
                  <p className="text-base font-bold text-gray-900">{healingStats.totalDuration} min</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ChartBarIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-2">
                  <p className="text-xs font-medium text-gray-500">Avg Duration</p>
                  <p className="text-base font-bold text-gray-900">{healingStats.averageDuration} min</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/exercises"
              className="card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <PlayIcon className="h-8 w-8 text-primary-600 group-hover:text-primary-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Start Exercise</h3>
                  <p className="text-sm text-gray-500">Choose from our exercise library</p>
                </div>
              </div>
            </Link>

            <Link
              to="/meals"
              className="card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <HeartIcon className="h-8 w-8 text-green-600 group-hover:text-green-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Plan Meal</h3>
                  <p className="text-sm text-gray-500">Discover healthy meal options</p>
                </div>
              </div>
            </Link>

            <Link
              to="/healing"
              className="card hover:shadow-md transition-shadow cursor-pointer group"
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-8 w-8 text-purple-600 group-hover:text-purple-700" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Healing Zone</h3>
                  <p className="text-sm text-gray-500">Explore wellness activities</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Exercises */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Recent Exercises</h3>
              <Link to="/exercises" className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {recentExercises.length > 0 ? (
                recentExercises.map((exercise) => (
                  <div key={exercise._id} className="flex items-center p-2 bg-gray-50 rounded">
                    <img
                      src={getExerciseImageUrl(exercise)}
                      alt={exercise.name}
                      className="w-8 h-8 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <div className="w-8 h-8 rounded bg-primary-100 flex items-center justify-center hidden">
                      <span className="text-primary-600 font-medium text-xs">
                        {(exercise.name || 'E').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-2 flex-1">
                      <h4 className="text-xs font-medium text-gray-900">{exercise.name}</h4>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(exercise.category)}`}>
                          {exercise.category}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">{exercise.duration}m</span>
                        {exercise.isCompleted && (
                          <span className="ml-1 text-xs text-green-600 font-medium">✓</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{exercise.calories} cal</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500">No exercises completed yet</p>
                  <Link to="/exercises" className="text-primary-600 hover:text-primary-700 text-xs font-medium mt-1 inline-block">
                    Start your first exercise
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Healing Activities */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <h3 className="text-base font-semibold text-gray-900">Recent Healing</h3>
                {apiStatus === 'fallback' && (
                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                    Demo Data
                  </span>
                )}
                {apiStatus === 'error' && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                    API Error
                  </span>
                )}
              </div>
              <Link to="/healing" className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {recentHealing.length > 0 ? (
                recentHealing.map((activity) => (
                  <div key={activity._id} className="flex items-center p-2 bg-gray-50 rounded">
                    {activity.imageUrl ? (
                      <img
                        src={getHealingImageUrl(activity)}
                        alt={activity.name || 'Healing Activity'}
                        className="w-8 h-8 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    {!activity.imageUrl && (
                      <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-medium text-xs">
                          {(activity.name || 'H').charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="w-8 h-8 rounded bg-purple-100 flex items-center justify-center hidden">
                      <span className="text-purple-600 font-medium text-xs">
                        {(activity.name || 'H').charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-2 flex-1">
                      <h4 className="text-xs font-medium text-gray-900">{activity.name || 'Healing Activity'}</h4>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(activity.category || 'wellness')}`}>
                          {activity.category || 'wellness'}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">{activity.duration || 0}m</span>
                        {activity.isCompleted && (
                          <span className="ml-1 text-xs text-green-600 font-medium">✓</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500">{activity.duration || 0}m</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs text-gray-500">
                    {apiStatus === 'error' 
                      ? 'Unable to load healing activities. Please check your connection.' 
                      : 'No healing activities completed yet'
                    }
                  </p>
                  <Link to="/healing" className="text-primary-600 hover:text-primary-700 text-xs font-medium mt-1 inline-block">
                    Start your first healing activity
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Recent Meals */}
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">Recent Meals</h3>
              <Link to="/meals" className="text-primary-600 hover:text-primary-700 text-xs font-medium">
                View all
              </Link>
            </div>
            <div className="space-y-2">
              {recentMeals.map((meal) => (
                <div key={meal._id} className="flex items-center p-2 bg-gray-50 rounded">
                  {meal.imageUrl ? (
                    <img
                      src={getMealImageUrl(meal)}
                      alt={meal.name || 'Meal'}
                      className="w-8 h-8 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {!meal.imageUrl && (
                    <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center">
                      <span className="text-green-600 font-medium text-xs">
                        {(meal.name || 'M').charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center hidden">
                    <span className="text-green-600 font-medium text-xs">
                      {(meal.name || 'M').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="ml-2 flex-1">
                    <h4 className="text-xs font-medium text-gray-900">{meal.name || 'Meal'}</h4>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(meal.category || 'regular')}`}>
                        {meal.category || 'regular'}
                      </span>
                      <span className="ml-1 text-xs text-gray-500">{meal.calories || 0} cal</span>
                    </div>
                  </div>
                  <Link
                    to={`/meals/${meal._id}`}
                    className="text-primary-600 hover:text-primary-700 text-xs font-medium"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Challenges</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.map((challenge) => (
                <div key={challenge._id} className="card">
                  {challenge.imageUrl ? (
                    <img
                      src={challenge.imageUrl}
                      alt={challenge.title || 'Challenge'}
                      className="w-full h-32 object-cover rounded-lg mb-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  {!challenge.imageUrl && (
                    <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center rounded-lg mb-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-yellow-600 font-bold text-xl">
                            {(challenge.title || 'C').charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <p className="text-yellow-600 font-medium text-sm">{challenge.title || 'Challenge'}</p>
                      </div>
                    </div>
                  )}
                  <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center rounded-lg mb-4 hidden">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-yellow-600 font-bold text-xl">
                          {(challenge.title || 'C').charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-yellow-600 font-medium text-sm">{challenge.title || 'Challenge'}</p>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title || 'Challenge'}</h3>
                  <p className="text-sm text-gray-600 mb-4">{challenge.description || 'No description available'}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {challenge.participants?.length || 0} participants
                    </span>
                    <Link
                      to={`/challenges/${challenge._id}`}
                      className="btn-primary text-sm"
                    >
                      Join Challenge
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 