import { useState } from 'react';
import { motion } from 'framer-motion';
import FeedSection from '@/components/organisms/FeedSection';
import TrendingSidebar from '@/components/organisms/TrendingSidebar';
import PostCreationModal from '@/components/organisms/PostCreationModal';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Home = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handlePostCreated = (newPost) => {
    // In a real app, you might want to refresh the feed or add the post to the top
    window.location.reload(); // Simple refresh for demo
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-display font-bold text-surface-900">Home Feed</h1>
                <p className="text-surface-600 mt-1">Stay connected with your network</p>
              </div>
              
              {/* Mobile Create Button */}
              <div className="lg:hidden">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => setShowCreateModal(true)}
                    className="rounded-full shadow-lg"
                  >
                    <ApperIcon name="Plus" className="w-5 h-5" />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Quick Create Post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-surface rounded-xl border border-surface-200 p-4 mb-6 shadow-sm"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                  <div className="w-full h-full rounded-full bg-surface-100 flex items-center justify-center">
                    <ApperIcon name="User" className="w-5 h-5 text-surface-600" />
                  </div>
                </div>
                
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 text-left px-4 py-3 bg-surface-50 rounded-full text-surface-500 hover:bg-surface-100 transition-colors duration-200"
                >
                  What's on your mind?
                </button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(true)}
                  className="rounded-full"
                >
                  <ApperIcon name="Image" className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>

            {/* Feed */}
            <FeedSection feedType="home" />
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block">
            <TrendingSidebar />
          </div>
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

export default Home;