import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ErrorState = ({ 
  message = 'Something went wrong',
  onRetry,
  className = '' 
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <div className="w-20 h-20 mx-auto bg-error/10 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name="AlertTriangle" className="w-10 h-10 text-error" />
      </div>
      
      <h3 className="text-xl font-semibold text-surface-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-surface-500 mb-6 max-w-sm mx-auto">
        {message}
      </p>
      
      {onRetry && (
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="primary"
            onClick={onRetry}
            icon="RefreshCw"
            className="px-6 py-3"
          >
            Try again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;