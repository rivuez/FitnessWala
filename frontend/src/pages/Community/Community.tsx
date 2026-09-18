import React, { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  ChatBubbleLeftRightIcon, 
  HeartIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { apiService } from '../../services/api';
import { Community, Post, User } from '../../types';
import toast from 'react-hot-toast';

const CommunityPage: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    communityId: ''
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCommunity !== 'all') {
      loadPosts(selectedCommunity);
    } else {
      loadPosts();
    }
  }, [selectedCommunity]);

  const loadData = async () => {
    try {
      const [communitiesResponse, postsResponse, userResponse] = await Promise.all([
        apiService.getCommunities(),
        apiService.getPosts(),
        apiService.getCurrentUser()
      ]);
      
      setCommunities(communitiesResponse.data || []);
      setPosts(postsResponse.data || []);
      setCurrentUser(userResponse.data || null);
    } catch (error) {
      toast.error('Failed to load community data');
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async (communityId?: string) => {
    try {
      const response = await apiService.getPosts(communityId);
      setPosts(response.data || []);
    } catch (error) {
      toast.error('Failed to load posts');
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim() || !newPost.communityId) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await apiService.createPost(newPost);
      if (response.data) {
        setPosts([response.data, ...posts]);
        setShowCreatePost(false);
        setNewPost({ title: '', content: '', communityId: '' });
        toast.success('Post created successfully!');
      }
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleLikePost = (postId: string) => {
    if (!currentUser) {
      toast.error('Please login to like posts');
      return;
    }

    setPosts(posts.map(post => {
      if (post._id === postId) {
        const isLiked = post.likes.includes(currentUser._id);
        return {
          ...post,
          likes: isLiked 
            ? post.likes.filter(id => id !== currentUser._id)
            : [...post.likes, currentUser._id]
        };
      }
      return post;
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
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
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Community</h1>
              <p className="text-gray-600">Connect with like-minded fitness enthusiasts</p>
            </div>
            <button
              onClick={() => setShowCreatePost(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Create Post
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <UsersIcon className="w-8 h-8 text-blue-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Communities</p>
                  <p className="text-2xl font-bold text-gray-900">{communities.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{posts.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center">
                <HeartIcon className="w-8 h-8 text-red-500" />
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Members</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {communities.reduce((sum, community) => sum + community.memberCount, 0)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Communities Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Communities</h2>
                <div className="flex items-center gap-2 mb-4">
                  <FunnelIcon className="w-5 h-5 text-gray-400" />
                  <select
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Communities</option>
                    {communities.map(community => (
                      <option key={community._id} value={community._id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {communities.map(community => (
                    <div 
                      key={community._id}
                      className={`p-4 rounded-lg cursor-pointer transition-colors ${
                        selectedCommunity === community._id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => setSelectedCommunity(community._id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900">{community.name}</h3>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          community.type === 'ayurvedic' ? 'bg-orange-100 text-orange-800' :
                          community.type === 'yoga' ? 'bg-purple-100 text-purple-800' :
                          community.type === 'calisthenics' ? 'bg-green-100 text-green-800' :
                          community.type === 'powerlifting' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {community.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{community.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <UsersIcon className="w-4 h-4 mr-1" />
                        {community.memberCount} members
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Posts Feed */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {posts.map(post => (
                <div key={post._id} className="bg-white rounded-lg shadow-sm">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <UserCircleIcon className="w-10 h-10 text-gray-400 mr-3" />
                        <div>
                          <h3 className="font-medium text-gray-900">{post.author.firstName} {post.author.lastName}</h3>
                          <p className="text-sm text-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()} • {post.community.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h4>
                    <p className="text-gray-600 mb-4">{post.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleLikePost(post._id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          currentUser && post.likes.includes(currentUser._id)
                            ? 'text-red-500 bg-red-50'
                            : 'text-gray-500 hover:text-red-500 hover:bg-red-50'
                        }`}
                      >
                        {currentUser && post.likes.includes(currentUser._id) ? (
                          <HeartSolidIcon className="w-5 h-5" />
                        ) : (
                          <HeartIcon className="w-5 h-5" />
                        )}
                        {post.likes.length} likes
                      </button>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{post.comments.length} comments</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <ChatBubbleLeftRightIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-500">Be the first to share something in this community!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Create Post</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter post title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Share your thoughts..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Community</label>
                <select
                  value={newPost.communityId}
                  onChange={(e) => setNewPost({...newPost, communityId: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a community</option>
                  {communities.map(community => (
                    <option key={community._id} value={community._id}>
                      {community.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreatePost(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Create Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityPage; 