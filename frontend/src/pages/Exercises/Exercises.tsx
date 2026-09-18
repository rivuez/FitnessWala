import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { Exercise } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  CheckCircleIcon,
  ClockIcon,
  FireIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { getExerciseImageUrl } from '../../utils/imageUtils';
import toast from 'react-hot-toast';

const Exercises: React.FC = () => {
  const { updateUserData } = useAuth();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'yoga', label: 'Yoga' },
    { value: 'zen', label: 'Zen' },
    { value: 'calisthenics', label: 'Calisthenics' },
    { value: 'powerlifting', label: 'Powerlifting' },
    { value: 'cardio', label: 'Cardio' },
    { value: 'strength', label: 'Strength' },
    { value: 'flexibility', label: 'Flexibility' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  useEffect(() => {
    loadExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchTerm, selectedCategory, selectedDifficulty]);

  const loadExercises = async () => {
    try {
      const response = await apiService.getExercises();
      if (response.success && response.data) {
        console.log('Exercises data from API:', response.data);
        setExercises(response.data);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(exercise => exercise.category === selectedCategory);
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(exercise => exercise.difficulty === selectedDifficulty);
    }

    setFilteredExercises(filtered);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      yoga: 'bg-purple-100 text-purple-800',
      zen: 'bg-blue-100 text-blue-800',
      calisthenics: 'bg-green-100 text-green-800',
      powerlifting: 'bg-red-100 text-red-800',
      cardio: 'bg-orange-100 text-orange-800',
      strength: 'bg-indigo-100 text-indigo-800',
      flexibility: 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const handleMarkComplete = async (exerciseId: string) => {
    try {
      const response = await apiService.markExerciseComplete(exerciseId);
      if (response.success && response.data) {
        setExercises(exercises.map(exercise => 
          exercise._id === exerciseId ? { ...exercise, isCompleted: true, completedAt: new Date().toISOString() } : exercise
        ));
        toast.success('Exercise marked as complete! 🎉');
        updateUserData(response.data);
        // Trigger dashboard refresh if available
        if (typeof window !== 'undefined' && (window as any).refreshDashboardData) {
          (window as any).refreshDashboardData();
        }
      }
    } catch (error) {
      toast.error('Failed to mark exercise as complete');
    }
  };

  const getExerciseQuantity = (exercise: Exercise) => {
    switch (exercise.category) {
      case 'yoga':
        return `${exercise.duration} minutes`;
      case 'zen':
        return `${exercise.duration} minutes`;
      case 'calisthenics':
        return '3 sets × 10 reps';
      case 'powerlifting':
        return '3 sets × 5 reps';
      case 'cardio':
        return `${exercise.duration} minutes`;
      case 'strength':
        return '4 sets × 8 reps';
      case 'flexibility':
        return `${exercise.duration} minutes`;
      default:
        return `${exercise.duration} minutes`;
    }
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Exercise Library</h1>
          <p className="mt-2 text-gray-600">
            Discover a wide variety of exercises to enhance your fitness journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exercises..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Showing {filteredExercises.length} of {exercises.length} exercises
          </p>
        </div>

        {/* Exercises Grid */}
        {filteredExercises.length === 0 ? (
          <div className="text-center py-12">
            <FunnelIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No exercises found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExercises.map((exercise) => (
              <div key={exercise._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <img
                  src={getExerciseImageUrl(exercise)}
                  alt={exercise.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                {!exercise.imageUrl && (
                  <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-primary-600 font-bold text-2xl">
                          {exercise.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <p className="text-primary-600 font-medium text-sm">{exercise.name}</p>
                    </div>
                  </div>
                )}
                <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center hidden">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-200 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-primary-600 font-bold text-2xl">
                        {exercise.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="text-primary-600 font-medium text-sm">{exercise.name}</p>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
                    {exercise.isCompleted && (
                      <div className="flex-shrink-0 ml-2">
                        <CheckCircleSolidIcon className="w-6 h-6 text-green-600" />
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{exercise.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(exercise.category)}`}>
                        {exercise.category}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                        {exercise.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {exercise.duration} min
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Quantity:</span>
                      <span className="font-medium">{getExerciseQuantity(exercise)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Calories:</span>
                      <div className="flex items-center">
                        <FireIcon className="w-4 h-4 mr-1 text-red-500" />
                        <span className="font-medium">{exercise.calories}</span>
                      </div>
                    </div>

                    {exercise.equipment && exercise.equipment.length > 0 && (
                      <div className="text-sm">
                        <span className="text-gray-600">Equipment: </span>
                        <span className="font-medium">{exercise.equipment.join(', ')}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <h4 className="text-sm font-medium text-gray-900">Instructions:</h4>
                    <ol className="text-xs text-gray-600 list-decimal list-inside space-y-1">
                      {exercise.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>

                  {exercise.injuryWarning && (
                    <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                      <div className="flex items-start">
                        <ExclamationTriangleIcon className="w-4 h-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-xs text-yellow-800">{exercise.injuryWarning}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    {exercise.isCompleted ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircleSolidIcon className="w-5 h-5 mr-2" />
                        <span className="text-sm font-medium">Completed</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMarkComplete(exercise._id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
                      >
                        Mark as Done
                      </button>
                    )}
                  </div>

                  {exercise.isCompleted && exercise.completedAt && (
                    <div className="mt-2 text-xs text-gray-500 text-center">
                      Completed on {new Date(exercise.completedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercises; 