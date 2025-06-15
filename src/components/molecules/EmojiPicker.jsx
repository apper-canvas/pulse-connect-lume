import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

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
        return 'bottom-full left-0 mb-2 z-50';
      case 'top-right':
        return 'bottom-full right-0 mb-2 z-50';
      case 'bottom-left':
        return 'top-full left-0 mt-2 z-50';
      case 'bottom-right':
        return 'top-full right-0 mt-2 z-50';
      case 'top-center':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50';
      case 'bottom-center':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2 z-50';
      default:
        return 'top-full left-0 mt-2 z-50';
    }
  };

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => onToggle(!isOpen)}
        className={`p-2 hover:bg-surface-100 ${buttonClassName}`}
      >
        <ApperIcon name="smile" size={20} />
      </Button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`absolute ${getPositionClasses()} bg-white rounded-lg shadow-xl border border-surface-200 z-[100] backdrop-blur-sm ${pickerClassName}`}
            style={{ zIndex: 1000 }}
          >
            <div className="p-2">
              <Picker
                data={data}
                onEmojiSelect={handleEmojiSelect}
                theme="light"
                set="apple"
                maxFrequentRows={2}
                perLine={8}
                navPosition="bottom"
                previewPosition="none"
                skinTonePosition="none"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EmojiPicker;