import React, { useState } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import CommentSection from "@/components/molecules/CommentSection";
import { postService, userService } from "@/services";
import { useNotifications } from "@/contexts/NotificationContext";
const PostCard = ({ post, user, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.likes?.includes('1') || false);
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const { addNotification } = useNotifications();
  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const currentUserId = '1'; // Demo current user
    
    try {
      // Optimistic update
      setIsLiked(!isLiked);
      setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
      
const updatedPost = await postService.toggleLike(post.id, currentUserId);
      
      // Create notification if this is a like (not unlike) and not user's own post
      if (updatedPost.likes.includes(currentUserId) && post.userId !== currentUserId) {
        await addNotification({
          type: 'like',
          actorId: currentUserId,
          postId: post.id,
          message: 'liked your post'
        });
      }
      
      // Update with server response
      setIsLiked(updatedPost.likes.includes(currentUserId));
      setLikesCount(updatedPost.likes.length);
      
      if (onUpdate) {
        onUpdate(updatedPost);
      }
    } catch (error) {
      // Rollback optimistic update
      setIsLiked(isLiked);
      setLikesCount(likesCount);
      toast.error('Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };
const handleCommentAdded = () => {
    if (onUpdate) {
      onUpdate({ ...post, commentsCount: post.commentsCount + 1 });
    }
  };

const handleShare = async () => {
    try {
      const shareData = {
        title: `Post by ${user?.name || 'Unknown User'}`,
        text: post?.content || 'Check out this post!',
        url: `${window.location.origin}/post/${post?.id || ''}`
      };

// Check if Web Share API is available and we're in a secure context
      if (navigator.share && window.isSecureContext) {
        // Additional check: Web Share API requires user activation
        try {
          await navigator.share(shareData);
          toast.success('Post shared successfully!');
        } catch (shareError) {
          if (shareError.name === 'NotAllowedError') {
            // Permission denied or not allowed - fall back to clipboard with permission check
            if (navigator.clipboard && window.isSecureContext) {
              try {
                // Check clipboard permissions first
                const permissionStatus = await navigator.permissions.query({ name: 'clipboard-write' });
                if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
                  await navigator.clipboard.writeText(shareData.url);
                  toast.success('Sharing not permitted. Post URL copied to clipboard instead!');
                } else {
                  // Clipboard permission denied - use manual fallback
                  window.prompt('Copy this URL to share the post:', shareData.url);
                }
              } catch (clipboardError) {
                // Clipboard permission check failed or writeText failed
                window.prompt('Copy this URL to share the post:', shareData.url);
              }
            } else {
              toast.error('Sharing is not available in this context.');
            }
          } else if (shareError.name !== 'AbortError') {
            // Other sharing errors (not user cancellation)
            throw shareError;
          }
          // AbortError (user cancelled) - do nothing
        }
      } else {
        // Fallback to clipboard if Web Share API not available or not secure context
        if (navigator.clipboard && window.isSecureContext) {
          try {
            // Check clipboard permissions first
            const permissionStatus = await navigator.permissions.query({ name: 'clipboard-write' });
            if (permissionStatus.state === 'granted' || permissionStatus.state === 'prompt') {
              await navigator.clipboard.writeText(shareData.url);
              toast.success('Post URL copied to clipboard!');
            } else {
              // Clipboard permission denied - use manual fallback
              window.prompt('Copy this URL to share the post:', shareData.url);
            }
          } catch (clipboardError) {
            // Clipboard permission check failed or writeText failed
            window.prompt('Copy this URL to share the post:', shareData.url);
          }
        } else {
          // Final fallback - show URL in alert for user to copy manually
          window.prompt('Copy this URL to share the post:', shareData.url);
        }
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      toast.error('Failed to share post. Please try again.');
    }
  };
return (
    <motion.div
    initial={{
        opacity: 0,
        y: 20
    }}
    animate={{
        opacity: 1,
        y: 0
    }}
    className="bg-surface rounded-xl border border-surface-200 shadow-sm hover:shadow-md transition-shadow duration-200">
    {/* Post Header */}
    <div className="p-4 flex items-center space-x-3">
        <Avatar
            src={user?.avatar}
            alt={user?.displayName}
            size="lg"
            hasStory={Math.random() > 0.5} />
        <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-surface-900 truncate">
                {user?.displayName || "Unknown User"}
            </h4>
            <p className="text-sm text-surface-500">@{user?.username}• {formatDistanceToNow(new Date(post.createdAt), {
                    addSuffix: true
                })}
            </p>
        </div>
        <Button variant="ghost" size="sm">
            <ApperIcon name="MoreHorizontal" className="w-5 h-5" />
        </Button>
    </div>
    {/* Post Content */}
    <div className="px-4 pb-3">
        <p className="text-surface-900 leading-relaxed break-words">
            {post.content}
        </p>
    </div>
    {/* Post Media */}
    {post.mediaUrls && post.mediaUrls.length > 0 && <div className="px-4 pb-3">
        <motion.div
            whileHover={{
                scale: 1.02
            }}
            className="relative overflow-hidden rounded-lg">
            <img
                src={post.mediaUrls[0]}
                alt="Post media"
                className="w-full h-auto max-h-96 object-cover"
                loading="lazy" />
        </motion.div>
    </div>}
    {/* Post Actions */}
    <div className="px-4 py-3 border-t border-surface-100">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
                <motion.button
                    whileHover={{
                        scale: 1.1
                    }}
                    whileTap={{
                        scale: 0.9
                    }}
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`flex items-center space-x-2 transition-colors duration-200 ${isLiked ? "text-accent" : "text-surface-500 hover:text-accent"}`}>
                    <motion.div
                        animate={isLiked ? {
                            scale: [1, 1.3, 1]
                        } : {
                            scale: 1
                        }}
                        transition={{
                            duration: 0.3
                        }}>
                        <ApperIcon
                            name={isLiked ? "Heart" : "Heart"}
                            className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                    </motion.div>
                    <span className="text-sm font-medium">{likesCount}</span>
                </motion.button>
                <motion.button
                    whileHover={{
                        scale: 1.1
                    }}
                    whileTap={{
                        scale: 0.9
                    }}
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 text-surface-500 hover:text-primary transition-colors duration-200">
                    <ApperIcon name="MessageCircle" className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.commentsCount || 0}</span>
                </motion.button>
                <motion.button
                    whileHover={{
                        scale: 1.1
                    }}
                    whileTap={{
                        scale: 0.9
                    }}
                    onClick={handleShare}
                    className="flex items-center space-x-2 text-surface-500 hover:text-secondary transition-colors duration-200">
                    <ApperIcon name="Share" className="w-5 h-5" />
                </motion.button>
            </div>
            <motion.button
                whileHover={{
                    scale: 1.1
                }}
                whileTap={{
                    scale: 0.9
                }}
                className="text-surface-500 hover:text-warning transition-colors duration-200">
                <ApperIcon name="Bookmark" className="w-5 h-5" />
            </motion.button>
        </div>
    </div>
    {/* Comments Section */}
    {showComments && <CommentSection postId={post.id} onCommentAdded={handleCommentAdded} />}
</motion.div>
  );
};

export default PostCard;