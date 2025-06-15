import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Avatar from '@/components/atoms/Avatar';
import Button from '@/components/atoms/Button';
import { followService, userService } from '@/services';

const UserCard = ({ user, currentUserId = '1', initialIsFollowing = false, onFollowChange }) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [followersCount, setFollowersCount] = useState(user.followersCount || 0);

  const handleFollowToggle = async () => {
    if (isLoading || user.id === currentUserId) return;

    setIsLoading(true);
    
    try {
      // Optimistic update
      const newFollowingState = !isFollowing;
      setIsFollowing(newFollowingState);
      setFollowersCount(prev => newFollowingState ? prev + 1 : prev - 1);

      const result = await followService.toggleFollow(currentUserId, user.id);
      
      // Update user counts in the service
      await userService.updateFollowCounts(
        currentUserId,
        result.action === 'followed' ? 1 : -1,
        user.id,
        result.action === 'followed' ? 1 : -1
      );

      toast.success(result.action === 'followed' ? 'Following user!' : 'Unfollowed user');
      
      if (onFollowChange) {
        onFollowChange(user.id, result.action === 'followed');
      }
    } catch (error) {
      // Rollback optimistic update
      setIsFollowing(isFollowing);
      setFollowersCount(user.followersCount);
      toast.error('Failed to update follow status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-surface rounded-xl border border-surface-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-center space-x-4">
        <Avatar 
          src={user.avatar} 
          alt={user.displayName} 
          size="xl"
          hasStory={Math.random() > 0.7}
        />
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-surface-900 truncate">
            {user.displayName}
          </h3>
          <p className="text-surface-500 text-sm truncate">
            @{user.username}
          </p>
          
          <div className="flex items-center space-x-4 mt-2 text-sm text-surface-600">
            <span>
              <span className="font-semibold text-surface-900">{user.postsCount || 0}</span> posts
            </span>
            <span>
              <span className="font-semibold text-surface-900">{followersCount}</span> followers
            </span>
            <span>
              <span className="font-semibold text-surface-900">{user.followingCount || 0}</span> following
            </span>
          </div>
        </div>
        
        {user.id !== currentUserId && (
          <Button
            variant={isFollowing ? "secondary" : "primary"}
            size="sm"
            onClick={handleFollowToggle}
            loading={isLoading}
            className="flex-shrink-0"
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </div>
      
      {user.bio && (
        <p className="mt-3 text-surface-700 text-sm break-words">
          {user.bio}
        </p>
      )}
    </motion.div>
  );
};

export default UserCard;