import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Avatar = ({ 
  src, 
  alt, 
  size = 'md', 
  className = '', 
  showOnline = false,
  hasStory = false,
  ...props 
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
    '3xl': 'w-24 h-24'
  };

  const onlineSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
    '3xl': 'w-6 h-6'
  };

  return (
    <div className="relative inline-block">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`relative ${sizes[size]} ${className}`}
        {...props}
      >
        {hasStory && (
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent via-secondary to-primary p-0.5">
            <div className="w-full h-full rounded-full bg-white p-0.5">
              {src ? (
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-surface-200 flex items-center justify-center">
                  <ApperIcon name="User" className="w-1/2 h-1/2 text-surface-500" />
                </div>
              )}
            </div>
          </div>
        )}
        
        {!hasStory && (
          <>
            {src ? (
              <img
                src={src}
                alt={alt}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-surface-200 flex items-center justify-center">
                <ApperIcon name="User" className="w-1/2 h-1/2 text-surface-500" />
              </div>
            )}
          </>
        )}
        
        {showOnline && (
          <div className={`absolute bottom-0 right-0 ${onlineSizes[size]} bg-success border-2 border-white rounded-full`} />
        )}
      </motion.div>
    </div>
  );
};

export default Avatar;