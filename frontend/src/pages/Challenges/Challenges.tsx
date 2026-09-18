import React, { useState, useEffect } from 'react';
import { 
  TrophyIcon, 
  CalendarIcon, 
  UsersIcon, 
  CheckCircleIcon,
  PlusIcon,
  ClockIcon,
  FireIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { fakeBackend } from '../../services/fakeBackend';
import { Challenge, User } from '../../types';
import toast from 'react-hot-toast';

const Challenges: React.FC = () => {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newChallenge, setNewChallenge] = useState({
    title: '',
    description: '',
    type: 'exercise' as const,
    requirements: {
      exercises: 0,
      meals: 0,
      healingActivities: 0,
      duration: 7
    },
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [challengesResponse, userResponse] = await Promise.all([
        fakeBackend.getChallenges(),
        fakeBackend.getCurrentUser()
      ]);
      
      setChallenges(challengesResponse.data || []);
      setCurrentUser(userResponse.data || null);
    } catch (error) {
      toast.error('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      const response = await fakeBackend.joinChallenge(challengeId);
      if (response.data) {
        setChallenges(challenges.map(challenge => 
          challenge._id === challengeId ? response.data! : challenge
        ));
        toast.success('Successfully joined the challenge!');
      }
    } catch (error) {
      toast.error('Failed to join challenge');
    }
  };

  const handleCreateChallenge = async () => {
    if (!newChallenge.title.trim() || !newChallenge.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const challengeData = {
        ...newChallenge,
        isActive: true
      };
      const response = await fakeBackend.createChallenge(challengeData);
      if (response.data) {
        setChallenges([response.data, ...challenges]);
        setShowCreateModal(false);
        setNewChallenge({
          title: '',
          description: '',
          type: 'exercise',
          requirements: {
            exercises: 0,
            meals: 0,
            healingActivities: 0,
            duration: 7
          },
          startDate: '',
          endDate: ''
        });
        toast.success('Challenge created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create challenge');
    }
  };

  const getChallengeProgress = (challenge: Challenge) => {
    if (!currentUser) return 0;
    
    const isParticipant = challenge.participants.includes(currentUser._id);
    if (!isParticipant) return 0;

    // Mock progress calculation
    const totalRequirements = (challenge.requirements.exercises || 0) + 
                            (challenge.requirements.meals || 0) + 
                            (challenge.requirements.healingActivities || 0);
    
    if (totalRequirements === 0) return 100;
    
    // Mock progress - in real app this would come from user's actual progress
    const completed = Math.floor(Math.random() * totalRequirements);
    return Math.min((completed / totalRequirements) * 100, 100);
  };

  const getDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Challenges</h1>
              <p className="text-gray-600">Push your limits and achieve your fitness goals</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Create Challenge
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <TrophyIcon className="w-8 h-8 text-yellow-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Active Challenges</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {challenges.filter(c => c.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <UsersIcon className="w-8 h-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Participants</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {challenges.reduce((sum, challenge) => sum + challenge.participants.length, 0)}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <CheckCircleIcon className="w-8 h-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {challenges.filter(c => !c.isActive).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <FireIcon className="w-8 h-8 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Your Streak</p>
                  <p className="text-2xl font-bold text-gray-900">5 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const progress = getChallengeProgress(challenge);
            const daysRemaining = getDaysRemaining(challenge.endDate);
            const isParticipant = currentUser ? challenge.participants.includes(currentUser._id) : false;
            
            return (
              <div key={challenge._id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                        challenge.type === 'exercise' ? 'bg-blue-100 text-blue-800' :
                        challenge.type === 'meal' ? 'bg-green-100 text-green-800' :
                        challenge.type === 'healing' ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {challenge.type}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {daysRemaining}d left
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Requirements:</span>
                                             <div className="flex gap-2">
                         {(challenge.requirements.exercises || 0) > 0 && (
                           <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                             {challenge.requirements.exercises || 0} exercises
                           </span>
                         )}
                         {(challenge.requirements.meals || 0) > 0 && (
                           <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                             {challenge.requirements.meals || 0} meals
                           </span>
                         )}
                         {(challenge.requirements.healingActivities || 0) > 0 && (
                           <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                             {challenge.requirements.healingActivities || 0} healing
                           </span>
                         )}
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{challenge.requirements.duration} days</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Participants:</span>
                      <span className="font-medium">{challenge.participants.length}</span>
                    </div>
                  </div>

                  {isParticipant && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {new Date(challenge.startDate).toLocaleDateString()} - {new Date(challenge.endDate).toLocaleDateString()}
                    </div>
                    
                    {isParticipant ? (
                      <div className="flex items-center text-green-600">
                        <CheckCircleSolidIcon className="w-5 h-5 mr-1" />
                        <span className="text-sm font-medium">Joined</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleJoinChallenge(challenge._id)}
                        disabled={!challenge.isActive}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          challenge.isActive
                            ? 'bg-orange-600 hover:bg-orange-700 text-white'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {challenge.isActive ? 'Join Challenge' : 'Challenge Ended'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {challenges.length === 0 && (
          <div className="text-center py-12">
            <TrophyIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No challenges available</h3>
            <p className="text-gray-500">Create a new challenge to get started!</p>
          </div>
        )}
      </div>

      {/* Create Challenge Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Challenge</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter challenge title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the challenge..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newChallenge.type}
                  onChange={(e) => setNewChallenge({...newChallenge, type: e.target.value as any})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="exercise">Exercise</option>
                  <option value="meal">Meal</option>
                  <option value="healing">Healing</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Exercises</label>
                  <input
                    type="number"
                    value={newChallenge.requirements.exercises}
                    onChange={(e) => setNewChallenge({
                      ...newChallenge, 
                      requirements: {...newChallenge.requirements, exercises: parseInt(e.target.value)}
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meals</label>
                  <input
                    type="number"
                    value={newChallenge.requirements.meals}
                    onChange={(e) => setNewChallenge({
                      ...newChallenge, 
                      requirements: {...newChallenge.requirements, meals: parseInt(e.target.value)}
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Healing Activities</label>
                  <input
                    type="number"
                    value={newChallenge.requirements.healingActivities}
                    onChange={(e) => setNewChallenge({
                      ...newChallenge, 
                      requirements: {...newChallenge.requirements, healingActivities: parseInt(e.target.value)}
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    value={newChallenge.requirements.duration}
                    onChange={(e) => setNewChallenge({
                      ...newChallenge, 
                      requirements: {...newChallenge.requirements, duration: parseInt(e.target.value)}
                    })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newChallenge.startDate}
                    onChange={(e) => setNewChallenge({...newChallenge, startDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newChallenge.endDate}
                    onChange={(e) => setNewChallenge({...newChallenge, endDate: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateChallenge}
                className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Create Challenge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges; 