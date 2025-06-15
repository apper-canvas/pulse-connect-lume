import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import UserCard from '@/components/molecules/UserCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ApperIcon from '@/components/ApperIcon';
import { userService, followService } from '@/services';

const TrendingSidebar = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followingUsers, setFollowingUsers] = useState(new Set());
  const currentUserId = '1'; // Demo current user

  useEffect(() => {
    loadTrendingUsers();
  }, []);

  const loadTrendingUsers = async () => {
    try {
      setLoading(true);
      
      const [allUsers, followingIds] = await Promise.all([
        userService.getAll(),
        followService.getFollowingIds(currentUserId)
      ]);
      
      // Filter out current user and get trending users (not followed)
      const trendingUsers = allUsers
        .filter(user => user.id !== currentUserId)
        .sort((a, b) => b.followersCount - a.followersCount)
        .slice(0, 3);
      
      setUsers(trendingUsers);
      setFollowingUsers(new Set(followingIds));
    } catch (error) {
      toast.error('Failed to load trending users');
    } finally {
      setLoading(false);
    }
  };

  const handleFollowChange = (userId, isFollowing) => {
    setFollowingUsers(prev => {
      const newSet = new Set(prev);
      if (isFollowing) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className="bg-surface rounded-xl border border-surface-200 p-6">
        <div className="h-6 bg-surface-200 rounded w-1/2 mb-4 animate-pulse" />
        <SkeletonLoader type="user" count={3} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-surface rounded-xl border border-surface-200 p-6 sticky top-6"
    >
      <div className="flex items-center space-x-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
          <ApperIcon name="TrendingUp" className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-surface-900">Trending Now</h2>
      </div>

      <div className="space-y-4">
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <UserCard
              user={user}
              currentUserId={currentUserId}
              initialIsFollowing={followingUsers.has(user.id)}
              onFollowChange={handleFollowChange}
            />
          </motion.div>
        ))}
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        className="mt-6 p-4 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg border border-primary/10"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <ApperIcon name="Sparkles" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-surface-900">Discover More</h3>
            <p className="text-sm text-surface-600">Find users that match your interests</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TrendingSidebar;