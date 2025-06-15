import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Input from '@/components/atoms/Input';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services';

const SearchBar = ({ placeholder = "Search users...", onUserSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        resultsRef.current && 
        !resultsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchUsers = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        setIsOpen(false);
        return;
      }

      setLoading(true);
      try {
        const searchResults = await userService.searchUsers(query.trim());
        setResults(searchResults);
        setIsOpen(true);
      } catch (error) {
        toast.error('Failed to search users');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchUsers, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleUserSelect = (user) => {
    setQuery('');
    setIsOpen(false);
    setResults([]);
    onUserSelect?.(user);
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <Input
        icon="Search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => query.length >= 2 && setIsOpen(true)}
        className="pr-10"
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <ApperIcon name="Loader2" className="w-4 h-4 animate-spin text-surface-400" />
        </div>
      )}

      <AnimatePresence>
        {isOpen && (results.length > 0 || loading) && (
          <motion.div
            ref={resultsRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-lg border border-surface-200 shadow-lg z-50 max-h-80 overflow-y-auto"
          >
            {loading ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-3 animate-pulse">
                    <div className="w-10 h-10 bg-surface-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-surface-200 rounded w-1/3" />
                      <div className="h-3 bg-surface-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                {results.map((user) => (
                  <motion.button
                    key={user.id}
                    whileHover={{ backgroundColor: '#f8fafc' }}
                    onClick={() => handleUserSelect(user)}
                    className="w-full px-4 py-3 flex items-center space-x-3 text-left hover:bg-surface-50 transition-colors duration-150"
                  >
                    <Avatar 
                      src={user.avatar} 
                      alt={user.displayName} 
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-surface-900 truncate">
                        {user.displayName}
                      </p>
                      <p className="text-sm text-surface-500 truncate">
                        @{user.username}
                      </p>
                    </div>
                    <ApperIcon name="ChevronRight" className="w-4 h-4 text-surface-400" />
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-surface-500">
                <ApperIcon name="Search" className="w-8 h-8 mx-auto mb-2 text-surface-300" />
                <p>No users found</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;