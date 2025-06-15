import { useState, forwardRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = forwardRef(({ 
  label,
  type = 'text',
  placeholder,
  error,
  icon,
  className = '',
  containerClassName = '',
  ...props 
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(props.value || props.defaultValue || '');

  const handleFocus = (e) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const handleChange = (e) => {
    setHasValue(e.target.value);
    props.onChange?.(e);
  };

  return (
    <div className={`relative ${containerClassName}`}>
      {label && (
        <motion.label
          initial={false}
          animate={{
            top: isFocused || hasValue ? '0.5rem' : '1rem',
            fontSize: isFocused || hasValue ? '0.75rem' : '1rem',
            color: isFocused ? '#6366F1' : error ? '#EF4444' : '#6B7280'
          }}
          transition={{ duration: 0.2 }}
          className="absolute left-3 pointer-events-none z-10 bg-white px-1 font-medium"
          style={{ transformOrigin: 'left center' }}
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
            <ApperIcon name={icon} className="w-5 h-5 text-surface-400" />
          </div>
        )}
        
        <input
          ref={ref}
          type={type}
          placeholder={label ? '' : placeholder}
          className={`w-full px-3 py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
            icon ? 'pl-10' : ''
          } ${
            error 
              ? 'border-error focus:border-error focus:ring-error/20' 
              : 'border-surface-300 hover:border-surface-400'
          } ${className}`}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1 text-sm text-error flex items-center"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4 mr-1" />
          {error}
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;