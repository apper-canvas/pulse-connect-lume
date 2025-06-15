import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PostCard from '@/components/molecules/PostCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import EmptyState from '@/components/molecules/EmptyState';
import ErrorState from '@/components/molecules/ErrorState';
import { postService, userService, followService } from '@/services';

const FeedSection = ({ feedType = 'home', topic = null }) => {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUserId = '1'; // Demo current user

  useEffect(() => {
    loadFeed();
  }, [feedType, topic]);

  const loadFeed = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let postsData;
      const usersData = await userService.getAll();
      
if (feedType === 'home') {
        // Get posts from followed users
        const followingIds = await followService.getFollowingIds(currentUserId);
        followingIds.push(currentUserId); // Include own posts
        postsData = await postService.getFeedPosts(followingIds);
      } else if (topic) {
        // Get posts filtered by topic
        postsData = await postService.getPostsByTopic(topic);
      } else {
        // Get all posts for explore
        postsData = await postService.getAll();
      }
      
      setPosts(postsData);
      
      // Create users map for quick lookup
      const usersMap = {};
      usersData.forEach(user => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);
    } catch (err) {
      setError(err.message || 'Failed to load feed');
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(prev => prev.map(post => 
      post.id === updatedPost.id ? updatedPost : post
    ));
  };

  if (loading) {
    return <SkeletonLoader type="post" count={5} />;
  }

  if (error) {
    return (
      <ErrorState 
        message={error}
        onRetry={loadFeed}
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={feedType === 'home' ? 'Users' : 'Search'}
        title={feedType === 'home' ? 'Your feed is empty' : 'No posts found'}
        description={feedType === 'home' 
          ? 'Follow some users to see their posts in your feed' 
          : 'Be the first to share something interesting!'
        }
        actionLabel={feedType === 'home' ? 'Discover users' : 'Create post'}
        onAction={() => {
          // Navigate to explore or create post
          toast.info(feedType === 'home' ? 'Navigate to Explore' : 'Navigate to Create');
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <PostCard
            post={post}
            user={users[post.userId]}
            onUpdate={handlePostUpdate}
          />
        </motion.div>
      ))}
    </div>
  );
};

export default FeedSection;