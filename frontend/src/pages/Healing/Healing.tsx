import React, { useState, useEffect } from 'react';
import { 
  HeartIcon, 
  SparklesIcon, 
  ClockIcon, 
  StarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { apiService } from '../../services/api';
import { HealingActivity } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const Healing: React.FC = () => {
  const { updateUserData } = useAuth();
  const [activities, setActivities] = useState<HealingActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<HealingActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: '',
    description: '',
    category: 'meditation' as const,
    duration: 15,
    benefits: '',
    instructions: ''
  });

  const categories = [
    { id: 'all', name: 'All Activities' },
    { id: 'meditation', name: 'Meditation' },
    { id: 'yoga', name: 'Yoga' },
    { id: 'breathing', name: 'Breathing' },
    { id: 'ayurvedic', name: 'Ayurvedic Remedies' },
    { id: 'wellness', name: 'Wellness' }
  ];

  useEffect(() => {
    loadActivities();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [activities, searchTerm, selectedCategory]);

  const loadActivities = async () => {
    try {
      const response = await apiService.getHealingActivities();
      setActivities(response.data || []);
    } catch (error) {
      toast.error('Failed to load healing activities');
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = activities;

    if (searchTerm) {
      filtered = filtered.filter(activity =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        activity.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(activity => activity.category === selectedCategory);
    }

    setFilteredActivities(filtered);
  };

  const handleAddActivity = async () => {
    try {
      const response = await apiService.createHealingActivity(newActivity);
      if (response.data) {
        setActivities([...activities, response.data]);
        setShowAddModal(false);
        setNewActivity({
          name: '',
          description: '',
          category: 'meditation' as const,
          duration: 15,
          benefits: '',
          instructions: ''
        });
        toast.success('Healing activity added successfully!');
      }
    } catch (error) {
      toast.error('Failed to add healing activity');
    }
  };

  const handleMarkComplete = async (activityId: string) => {
    try {
      const response = await apiService.markHealingActivityComplete(activityId);
      if (response.success && response.data) {
        setActivities(activities.map(activity => 
          activity._id === activityId ? { ...activity, isCompleted: true, completedAt: new Date().toISOString() } : activity
        ));
        toast.success('Healing activity marked as complete! 🧘‍♀️');
        updateUserData(response.data);
        // Trigger dashboard refresh if available
        if (typeof window !== 'undefined' && (window as any).refreshDashboardData) {
          (window as any).refreshDashboardData();
        }
      }
    } catch (error) {
      toast.error('Failed to mark healing activity as complete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Healing Zone</h1>
              <p className="text-gray-600">Discover ancient wisdom and modern wellness practices</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Activity
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <HeartIcon className="w-8 h-8 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <SparklesIcon className="w-8 h-8 text-purple-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Completed Today</p>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <ClockIcon className="w-8 h-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Time</p>
                  <p className="text-2xl font-bold text-gray-900">45m</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <StarIcon className="w-8 h-8 text-yellow-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Streak</p>
                  <p className="text-2xl font-bold text-gray-900">7 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search healing activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div key={activity._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{activity.name}</h3>
                      {activity.isCompleted && (
                        <CheckCircleSolidIcon className="w-6 h-6 text-green-600 flex-shrink-0 ml-2" />
                      )}
                    </div>
                    <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                      activity.category === 'meditation' ? 'bg-purple-100 text-purple-800' :
                      activity.category === 'yoga' ? 'bg-blue-100 text-blue-800' :
                      activity.category === 'breathing' ? 'bg-green-100 text-green-800' :
                      activity.category === 'ayurvedic' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {activity.category}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 ml-4">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {activity.duration}m
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{activity.description}</p>
                
                <div className="space-y-2 mb-4">
                  <h4 className="text-sm font-medium text-gray-900">Benefits:</h4>
                  <p className="text-sm text-gray-600">{activity.benefits}</p>
                </div>

                <div className="space-y-2 mb-6">
                  <h4 className="text-sm font-medium text-gray-900">Instructions:</h4>
                  <p className="text-sm text-gray-600">{activity.instructions}</p>
                </div>

                {activity.isCompleted ? (
                  <div className="flex items-center justify-center text-green-600">
                    <CheckCircleSolidIcon className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">Completed</span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleMarkComplete(activity._id)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    Mark as Done
                  </button>
                )}

                {activity.isCompleted && activity.completedAt && (
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    Completed on {new Date(activity.completedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <SparklesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add Healing Activity</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({...newActivity, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={newActivity.category}
                  onChange={(e) => setNewActivity({...newActivity, category: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  <option value="meditation">Meditation</option>
                  <option value="yoga">Yoga</option>
                  <option value="breathing">Breathing</option>
                  <option value="ayurvedic">Ayurvedic Remedies</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input
                  type="number"
                  value={newActivity.duration}
                  onChange={(e) => setNewActivity({...newActivity, duration: parseInt(e.target.value)})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Benefits</label>
                <textarea
                  value={newActivity.benefits}
                  onChange={(e) => setNewActivity({...newActivity, benefits: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Instructions</label>
                <textarea
                  value={newActivity.instructions}
                  onChange={(e) => setNewActivity({...newActivity, instructions: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  rows={3}
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddActivity}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Add Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Healing; 