import { useState } from 'react';
import { motion } from 'framer-motion';
import FeedSection from '@/components/organisms/FeedSection';
import SearchBar from '@/components/molecules/SearchBar';
import UserCard from '@/components/molecules/UserCard';
import ApperIcon from '@/components/ApperIcon';

const Explore = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleUserSelect = (user) => {
    setSearchResults([user]);
    setShowSearchResults(true);
  };

  const clearSearch = () => {
    setSearchResults([]);
    setShowSearchResults(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <ApperIcon name="Search" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-surface-900">Explore</h1>
              <p className="text-surface-600">Discover new content and connect with others</p>
            </div>
          </div>
          
          {/* Search Bar */}
          <SearchBar 
            placeholder="Search for users..."
            onUserSelect={handleUserSelect}
          />
          
          {showSearchResults && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={clearSearch}
              className="mt-3 text-sm text-primary hover:text-primary/80 font-medium flex items-center space-x-1"
            >
              <ApperIcon name="X" className="w-4 h-4" />
              <span>Clear search</span>
            </motion.button>
          )}
        </div>

        {/* Search Results */}
        {showSearchResults && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Search Results</h2>
            <div className="space-y-4">
              {searchResults.map(user => (
                <UserCard key={user.id} user={user} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Trending Topics */}
        {!showSearchResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-surface-900 mb-4">Trending Topics</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { tag: '#design', count: '12.4K' },
                { tag: '#photography', count: '8.9K' },
                { tag: '#tech', count: '15.2K' },
                { tag: '#travel', count: '6.7K' },
                { tag: '#food', count: '9.3K' }
              ].map((topic, index) => (
                <motion.button
                  key={topic.tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-surface rounded-full px-4 py-2 border border-surface-200 hover:border-primary hover:bg-primary/5 transition-all duration-200"
                >
                  <div className="text-left">
                    <p className="font-medium text-surface-900">{topic.tag}</p>
                    <p className="text-sm text-surface-500">{topic.count} posts</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recent Posts */}
        <div>
          <h2 className="text-lg font-semibold text-surface-900 mb-6">
            {showSearchResults ? 'All Posts' : 'Recent Posts'}
          </h2>
          <FeedSection feedType="explore" />
        </div>
      </div>
    </div>
  );
};

export default Explore;