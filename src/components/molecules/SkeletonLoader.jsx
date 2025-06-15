import { motion } from 'framer-motion';

const SkeletonLoader = ({ type = 'post', count = 3 }) => {
  const skeletons = [...Array(count)].map((_, i) => i);

  if (type === 'post') {
    return (
      <div className="space-y-6">
        {skeletons.map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface rounded-xl border border-surface-200 p-4 animate-pulse"
          >
            {/* Header */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-surface-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-200 rounded w-1/3" />
                <div className="h-3 bg-surface-200 rounded w-1/2" />
              </div>
            </div>
            
            {/* Content */}
            <div className="space-y-3 mb-4">
              <div className="h-4 bg-surface-200 rounded w-full" />
              <div className="h-4 bg-surface-200 rounded w-3/4" />
              <div className="h-4 bg-surface-200 rounded w-1/2" />
            </div>
            
            {/* Media placeholder */}
            {Math.random() > 0.5 && (
              <div className="h-48 bg-surface-200 rounded-lg mb-4" />
            )}
            
            {/* Actions */}
            <div className="flex items-center space-x-6 pt-3 border-t border-surface-100">
              <div className="h-5 bg-surface-200 rounded w-12" />
              <div className="h-5 bg-surface-200 rounded w-12" />
              <div className="h-5 bg-surface-200 rounded w-12" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'user') {
    return (
      <div className="space-y-4">
        {skeletons.map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface rounded-xl border border-surface-200 p-6 animate-pulse"
          >
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-surface-200 rounded-full" />
              <div className="flex-1 space-y-3">
                <div className="h-5 bg-surface-200 rounded w-1/3" />
                <div className="h-4 bg-surface-200 rounded w-1/2" />
                <div className="h-3 bg-surface-200 rounded w-2/3" />
              </div>
              <div className="h-8 bg-surface-200 rounded w-20" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'message') {
    return (
      <div className="space-y-3">
        {skeletons.map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center space-x-3 p-3 animate-pulse"
          >
            <div className="w-12 h-12 bg-surface-200 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-200 rounded w-1/4" />
              <div className="h-3 bg-surface-200 rounded w-3/4" />
            </div>
            <div className="h-3 bg-surface-200 rounded w-12" />
          </motion.div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;