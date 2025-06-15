import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { postService, userService } from '@/services';

const PostCreationModal = ({ isOpen, onClose, onPostCreated }) => {
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Load current user on mount
  useState(() => {
    userService.getCurrentUser().then(setCurrentUser);
  }, []);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!isImage && !isVideo) {
        toast.error('Please select image or video files only');
        return false;
      }
      
      if (file.size > maxSize) {
        toast.error('File size should be less than 10MB');
        return false;
      }
      
      return true;
    });

    if (validFiles.length === 0) return;

    setMediaFiles(prev => [...prev, ...validFiles].slice(0, 4)); // Max 4 files

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setMediaPreview(prev => [...prev, {
          url: e.target.result,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          name: file.name
        }].slice(0, 4));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error('Please add some content or media');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate media upload - in real app, upload to cloud storage
      const mediaUrls = mediaFiles.length > 0 
        ? ['https://images.unsplash.com/photo-1558655146-364adaf1fcc9?w=600&h=400&fit=crop'] 
        : [];

      const postData = {
        userId: '1', // Demo current user
        content: content.trim(),
        mediaUrls,
        mediaType: mediaFiles.length > 0 
          ? (mediaFiles[0].type.startsWith('image/') ? 'image' : 'video')
          : 'text'
      };

      const newPost = await postService.create(postData);
      
      toast.success('Post created successfully!');
      
      // Reset form
      setContent('');
      setMediaFiles([]);
      setMediaPreview([]);
      
      if (onPostCreated) {
        onPostCreated(newPost);
      }
      
      onClose();
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setContent('');
    setMediaFiles([]);
    setMediaPreview([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-surface rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-surface-200">
            <h2 className="text-lg font-semibold text-surface-900">Create Post</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-140px)]">
            <div className="p-4 flex-1 overflow-y-auto">
              {/* User Info */}
              <div className="flex items-center space-x-3 mb-4">
                <Avatar 
                  src={currentUser?.avatar} 
                  alt={currentUser?.displayName} 
                  size="md"
                />
                <div>
                  <p className="font-medium text-surface-900">
                    {currentUser?.displayName || 'User'}
                  </p>
                  <p className="text-sm text-surface-500">
                    @{currentUser?.username || 'username'}
                  </p>
                </div>
              </div>

              {/* Content Input */}
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full p-0 border-none resize-none focus:outline-none text-surface-900 placeholder-surface-500 text-lg min-h-[120px]"
                maxLength={500}
              />

              {/* Character Count */}
              <div className="flex justify-end mb-4">
                <span className={`text-sm ${content.length > 450 ? 'text-warning' : 'text-surface-400'}`}>
                  {content.length}/500
                </span>
              </div>

              {/* Media Preview */}
              {mediaPreview.length > 0 && (
                <div className="mb-4">
                  <div className="grid grid-cols-2 gap-2">
                    {mediaPreview.map((media, index) => (
                      <div key={index} className="relative group">
                        {media.type === 'image' ? (
                          <img
                            src={media.url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={media.url}
                            className="w-full h-32 object-cover rounded-lg"
                            controls
                          />
                        )}
                        <button
                          type="button"
                          onClick={() => removeMedia(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ApperIcon name="X" className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-surface-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting || mediaFiles.length >= 4}
                  >
                    <ApperIcon name="Image" className="w-5 h-5" />
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isSubmitting}
                  >
                    <ApperIcon name="MapPin" className="w-5 h-5" />
                  </Button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={(!content.trim() && mediaFiles.length === 0) || isSubmitting}
                  loading={isSubmitting}
                  className="px-6"
                >
                  Post
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PostCreationModal;