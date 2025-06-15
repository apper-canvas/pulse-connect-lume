import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const EmojiPicker = ({ 
  isOpen, 
  onToggle, 
  onEmojiSelect, 
  buttonClassName = "",
  pickerClassName = "",
  position = "bottom-left" 
}) => {
  const pickerRef = useRef(null);

  // Handle click outside to close picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  const handleEmojiSelect = (emoji) => {
    onEmojiSelect(emoji.native);
    onToggle(false);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'bottom-full left-0 mb-2';
      case 'top-right':
        return 'bottom-full right-0 mb-2';
      case 'bottom-right':
        return 'top-full right-0 mt-2';
      default: // bottom-left
        return 'top-full left-0 mt-2';
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onToggle(!isOpen)}
        className={`text-accent hover:bg-accent/10 ${buttonClassName}`}
      >
        <ApperIcon name="Smile" className="w-5 h-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${getPositionClasses()} ${pickerClassName}`}
          >
            <div className="bg-surface rounded-xl border border-surface-200 shadow-lg overflow-hidden">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
                set="native"
                previewPosition="none"
                skinTonePosition="search"
                maxFrequentRows={2}
                perLine={8}
                emojiSize={20}
                emojiButtonSize={32}
                categories={[
                  'frequent',
                  'people',
                  'nature',
                  'foods',
                  'activity',
                  'places',
                  'objects',
                  'symbols',
                  'flags'
                ]}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmojiPicker;