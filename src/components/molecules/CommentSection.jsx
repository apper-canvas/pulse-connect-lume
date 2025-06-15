import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { commentService, postService, userService } from "@/services";

const CommentSection = ({ postId, onCommentAdded }) => {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState({});
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [likedComments, setLikedComments] = useState({});
  const [replyMode, setReplyMode] = useState({});
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    loadComments();
  }, [postId]);
  const loadComments = async () => {
    try {
      setLoading(true);
      const [commentsData, usersData] = await Promise.all([
        commentService.getByPostId(postId),
        userService.getAll()
      ]);
      
      setComments(commentsData);
      
      const usersMap = {};
      usersData.forEach(user => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);
    } catch (error) {
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

const currentUserId = '1'; // Demo current user
    
    try {
      setSubmitting(true);
      
      const commentData = {
        postId,
        userId: currentUserId,
        content: newComment.trim()
      };
      
      const [newCommentData] = await Promise.all([
        commentService.create(commentData),
        postService.incrementCommentCount(postId)
      ]);
      
      setComments(prev => [...prev, newCommentData]);
      setNewComment('');
      onCommentAdded?.();
      
      toast.success('Comment added!');
    } catch (error) {
      toast.error('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };
  const handleLike = async (commentId) => {
    const currentUserId = '1'; // Demo current user
    
    try {
      const isLiked = likedComments[commentId];
      
      // Optimistic update
      setLikedComments(prev => ({
        ...prev,
        [commentId]: !isLiked
      }));
      
      // Update comment likes in backend
      await commentService.toggleLike(commentId, currentUserId);
      
      // Update local comments state
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? {
              ...comment,
              likes: isLiked 
                ? (comment.likes || []).filter(id => id !== currentUserId)
                : [...(comment.likes || []), currentUserId]
            }
          : comment
      ));
      
    } catch (error) {
      // Revert optimistic update on error
      setLikedComments(prev => ({
        ...prev,
        [commentId]: !prev[commentId]
      }));
      toast.error('Failed to update like');
    }
  };

  const handleReply = (commentId) => {
    setReplyMode(prev => ({
      ...prev,
      [commentId]: !prev[commentId]
    }));
    
    if (!replyMode[commentId]) {
      setReplyText(prev => ({
        ...prev,
        [commentId]: ''
      }));
    }
  };

  const handleSubmitReply = async (commentId) => {
    const currentUserId = '1'; // Demo current user
    const reply = replyText[commentId];
    
    if (!reply?.trim()) return;
    
    try {
      const replyData = {
        postId,
        userId: currentUserId,
        content: reply.trim(),
        parentId: commentId
      };
      
      const newReply = await commentService.create(replyData);
      
      setComments(prev => [...prev, newReply]);
      setReplyText(prev => ({
        ...prev,
        [commentId]: ''
      }));
      setReplyMode(prev => ({
        ...prev,
        [commentId]: false
      }));
      
      toast.success('Reply added!');
    } catch (error) {
      toast.error('Failed to add reply');
}
  };

  if (loading) {
    return (
      <div className="border-t border-surface-100 p-4">
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex space-x-3 animate-pulse">
              <div className="w-8 h-8 bg-surface-200 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-surface-200 rounded w-1/4" />
                <div className="h-4 bg-surface-200 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-surface-100">
      {/* Comments List */}
      {comments.length > 0 && (
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {comments.map((comment, index) => {
              const user = users[comment.userId];
              return (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex space-x-3"
                >
                  <Avatar 
                    src={user?.avatar} 
                    alt={user?.displayName} 
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="bg-surface-50 rounded-2xl px-3 py-2">
                      <p className="font-semibold text-sm text-surface-900">
                        {user?.displayName || 'Unknown User'}
                      </p>
                      <p className="text-surface-800 break-words">
                        {comment.content}
                      </p>
                    </div>
<div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-surface-500">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </span>
                      <button
                        onClick={() => handleLike(comment.id)}
                        className={`text-xs font-medium transition-colors ${
                          likedComments[comment.id] 
                            ? 'text-primary-600 hover:text-primary-700' 
                            : 'text-surface-500 hover:text-surface-700'
                        }`}
                      >
                        Like {comment.likes?.length > 0 && `(${comment.likes.length})`}
                      </button>
                      <button 
                        onClick={() => handleReply(comment.id)}
                        className="text-xs text-surface-500 hover:text-surface-700 font-medium"
                      >
                        Reply
                      </button>
                    </div>
                    
                    {replyMode[comment.id] && (
                      <div className="mt-3 ml-4 border-l-2 border-surface-200 pl-4">
                        <div className="flex gap-2">
                          <Input
                            value={replyText[comment.id] || ''}
                            onChange={(e) => setReplyText(prev => ({
                              ...prev,
                              [comment.id]: e.target.value
                            }))}
                            placeholder="Write a reply..."
                            className="flex-1 text-sm"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleSubmitReply(comment.id)}
                            disabled={!replyText[comment.id]?.trim()}
                          >
                            Reply
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleReply(comment.id)}
                          >
                            Cancel
                          </Button>
                        </div>
</div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Comment Input */}
      <div className="p-4 border-t border-surface-100">
        <form onSubmit={handleSubmitComment} className="flex space-x-3">
          <Avatar 
            src={users['1']?.avatar} 
            alt={users['1']?.displayName} 
            size="sm"
          />
          <div className="flex-1">
            <Input
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="resize-none border-surface-200 rounded-full"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!newComment.trim() || submitting}
            loading={submitting}
            className="rounded-full"
          >
            <ApperIcon name="Send" className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
);
};

export default CommentSection;