import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import PostCard from '@/components/molecules/PostCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import PostCreationModal from '@/components/organisms/PostCreationModal';
import ApperIcon from '@/components/ApperIcon';
import { userService, postService, followService } from '@/services';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [followStats, setFollowStats] = useState({ followers: 0, following: 0 });
  const currentUserId = '1'; // Demo current user

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [userData, userPosts, followers, following] = await Promise.all([
        userService.getCurrentUser(),
        postService.getByUserId(currentUserId),
        followService.getFollowers(currentUserId),
        followService.getFollowing(currentUserId)
      ]);
      
      setUser(userData);
      setPosts(userPosts);
      setFollowStats({
        followers: followers.length,
        following: following.length
      });
    } catch (err) {
      setError(err.message || 'Failed to load profile');
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePostCreated = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
    setUser(prev => prev ? { ...prev, postsCount: prev.postsCount + 1 } : null);
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {/* Profile Header Skeleton */}
          <div className="bg-surface rounded-xl border border-surface-200 p-6 mb-6 animate-pulse">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-24 h-24 bg-surface-200 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-6 bg-surface-200 rounded w-1/3" />
                <div className="h-4 bg-surface-200 rounded w-1/4" />
                <div className="h-4 bg-surface-200 rounded w-2/3" />
                <div className="flex space-x-6">
                  <div className="h-4 bg-surface-200 rounded w-16" />
                  <div className="h-4 bg-surface-200 rounded w-16" />
                  <div className="h-4 bg-surface-200 rounded w-16" />
                </div>
              </div>
            </div>
          </div>
          
          <SkeletonLoader type="post" count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <ErrorState 
            message={error}
            onRetry={loadProfile}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl border border-surface-200 p-6 mb-6 shadow-sm"
        >
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Avatar
                src={user?.avatar}
                alt={user?.displayName}
                size="3xl"
                hasStory={true}
              />
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                <ApperIcon name="Camera" className="w-4 h-4 text-white" />
              </button>
            </motion.div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-display font-bold text-surface-900">
                    {user?.displayName || 'User Name'}
                  </h1>
                  <p className="text-surface-600">@{user?.username || 'username'}</p>
                </div>
                
                <div className="flex space-x-2 mt-4 sm:mt-0">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setShowCreateModal(true)}
                  >
                    <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                  <Button variant="secondary" size="sm">
                    <ApperIcon name="Settings" className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Bio */}
              {user?.bio && (
                <p className="text-surface-700 mb-4 break-words">
                  {user.bio}
                </p>
              )}

              {/* Stats */}
              <div className="flex space-x-6 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-surface-900">{posts.length}</p>
                  <p className="text-surface-600">Posts</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-surface-900">{followStats.followers}</p>
                  <p className="text-surface-600">followers</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-surface-900">{followStats.following}</p>
                  <p className="text-surface-600">Following</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Profile Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl border border-surface-200 mb-6 overflow-hidden"
        >
          <div className="flex border-b border-surface-200">
            {[
              { id: 'posts', label: 'Posts', icon: 'Grid3X3', count: posts.length },
              { id: 'media', label: 'Media', icon: 'Image', count: posts.filter(p => p.mediaUrls?.length > 0).length },
              { id: 'likes', label: 'Likes', icon: 'Heart', count: posts.reduce((acc, post) => acc + (post.likes?.length || 0), 0) }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
                  activeTab === tab.id
                    ? 'text-primary border-b-2 border-primary bg-primary/5'
                    : 'text-surface-600 hover:text-surface-900 hover:bg-surface-50'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
                <span className="text-xs bg-surface-200 text-surface-600 px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <div>
          {activeTab === 'posts' && (
            <div className="space-y-6">
              {posts.length === 0 ? (
                <EmptyState
                  icon="FileText"
                  title="No posts yet"
                  description="Share your first post to get started"
                  actionLabel="Create Post"
                  onAction={() => setShowCreateModal(true)}
                />
              ) : (
                posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PostCard
                      post={post}
                      user={user}
                      onUpdate={handlePostUpdate}
                    />
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              {posts.filter(p => p.mediaUrls?.length > 0).length === 0 ? (
                <EmptyState
                  icon="Image"
                  title="No media posts"
                  description="Share photos and videos to see them here"
                  actionLabel="Upload Media"
                  onAction={() => setShowCreateModal(true)}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {posts
                    .filter(post => post.mediaUrls?.length > 0)
                    .map((post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="aspect-square rounded-lg overflow-hidden cursor-pointer"
                      >
                        <img
                          src={post.mediaUrls[0]}
                          alt="Post media"
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                    ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'likes' && (
            <EmptyState
              icon="Heart"
              title="Liked posts"
              description="Posts you've liked will appear here"
            />
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      <PostCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
};

export default Profile;