import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import EmojiPicker from "@/components/molecules/EmojiPicker";
import { postService, userService } from "@/services";

const CreatePost = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreview, setMediaPreview] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

// Load current user
  React.useEffect(() => {
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

      await postService.create(postData);
      
      toast.success('Post created successfully!');
      navigate('/home');
    } catch (error) {
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (content.trim() || mediaFiles.length > 0) {
      const confirmed = window.confirm('Are you sure you want to cancel? Your changes will be lost.');
      if (!confirmed) return;
    }
    navigate(-1);
};

  const handleEmojiSelect = (emoji) => {
    const textarea = textareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = content.substring(0, start) + emoji + content.substring(end);
      setContent(newContent);
      
      // Restore cursor position after emoji insertion
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
      }, 0);
    } else {
      setContent(prev => prev + emoji);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg custom-gradient flex items-center justify-center">
              <ApperIcon name="Plus" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-surface-900">Create Post</h1>
              <p className="text-surface-600">Share what's on your mind</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </Button>
        </motion.div>

        {/* Post Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface rounded-xl border border-surface-200 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="p-6">
            {/* User Info */}
            <div className="flex items-center space-x-3 mb-6">
              <Avatar 
                src={currentUser?.avatar} 
                alt={currentUser?.displayName} 
                size="lg"
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
            <div className="mb-6">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's happening? Share your thoughts..."
                className="w-full p-0 border-none resize-none focus:outline-none text-surface-900 placeholder-surface-500 text-lg min-h-[150px] bg-transparent"
                maxLength={500}
                disabled={isSubmitting}
              />
              
              {/* Character Count */}
              <div className="flex justify-end mt-2">
                <span className={`text-sm ${content.length > 450 ? 'text-warning' : 'text-surface-400'}`}>
                  {content.length}/500
                </span>
              </div>
            </div>

            {/* Media Preview */}
            {mediaPreview.length > 0 && (
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-3">
                  {mediaPreview.map((media, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative group aspect-square rounded-lg overflow-hidden"
                    >
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="w-full h-full object-cover"
                          controls
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        disabled={isSubmitting}
                        className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                      >
                        <ApperIcon name="Trash2" className="w-4 h-4 text-white" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Post Options */}
            <div className="border-t border-surface-100 pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                  
<Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting || mediaFiles.length >= 4}
                    className="text-primary hover:bg-primary/10"
                  >
                    <ApperIcon name="Image" className="w-5 h-5 mr-2" />
                    Media
                  </Button>
                </div>
              </div>
              {/* Post Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-surface-200">
                <div className="flex items-center space-x-2 relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isSubmitting}
                    className="text-secondary hover:bg-secondary/10"
                  >
                    <ApperIcon name="Image" className="w-5 h-5 mr-2" />
                    Media
                  </Button>
                  
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={isSubmitting}
                    className="text-secondary hover:bg-secondary/10"
                  >
                    <ApperIcon name="MapPin" className="w-5 h-5 mr-2" />
                    Location
                  </Button>
                  
                  <EmojiPicker
                    isOpen={showEmojiPicker}
                    onToggle={setShowEmojiPicker}
                    onEmojiSelect={handleEmojiSelect}
                    buttonClassName="mr-2"
                    position="top-right"
                    containerClassName="z-[100] relative"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={(!content.trim() && mediaFiles.length === 0) || isSubmitting}
                    loading={isSubmitting}
                    className="px-8"
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 bg-surface rounded-xl border border-surface-200 p-4"
        >
          <h3 className="font-medium text-surface-900 mb-2 flex items-center">
            <ApperIcon name="Lightbulb" className="w-4 h-4 mr-2 text-warning" />
            Tips for great posts
          </h3>
          <ul className="text-sm text-surface-600 space-y-1">
            <li>• Keep your content engaging and authentic</li>
            <li>• Use high-quality images and videos</li>
            <li>• Add relevant hashtags to reach more people</li>
            <li>• Ask questions to encourage engagement</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default CreatePost;