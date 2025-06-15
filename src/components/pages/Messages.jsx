import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import SkeletonLoader from "@/components/molecules/SkeletonLoader";
import EmptyState from "@/components/molecules/EmptyState";
import ApperIcon from "@/components/ApperIcon";
import EmojiPicker from "@/components/molecules/EmojiPicker";
import { messageService, userService } from "@/services";
const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState({});
  const [newMessage, setNewMessage] = useState('');
const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showOptionsDropdown, setShowOptionsDropdown] = useState(false);
  const [callingState, setCallingState] = useState({ isCall: false, isVideo: false });
  const messagesEndRef = useRef(null);
  const optionsDropdownRef = useRef(null);
  const currentUserId = '1'; // Demo current user
  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (activeConversation) {
      loadMessages(activeConversation.partnerId);
    }
  }, [activeConversation]);

useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsDropdownRef.current && !optionsDropdownRef.current.contains(event.target)) {
        setShowOptionsDropdown(false);
      }
    };

    if (showOptionsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showOptionsDropdown]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const [conversationsData, usersData] = await Promise.all([
        messageService.getConversations(currentUserId),
        userService.getAll()
      ]);
      
      setConversations(conversationsData);
      
      const usersMap = {};
      usersData.forEach(user => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);
      
      // Auto-select first conversation if exists
      if (conversationsData.length > 0) {
        setActiveConversation(conversationsData[0]);
      }
    } catch (error) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (partnerId) => {
    try {
      setLoadingMessages(true);
      const messagesData = await messageService.getConversation(currentUserId, partnerId);
      setMessages(messagesData);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeConversation || sending) return;

    setSending(true);
    
    try {
      const messageData = {
        senderId: currentUserId,
        receiverId: activeConversation.partnerId,
        content: newMessage.trim()
      };
      
      const sentMessage = await messageService.create(messageData);
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Update conversation in list
      setConversations(prev => prev.map(conv => 
        conv.partnerId === activeConversation.partnerId
          ? { ...conv, lastMessage: sentMessage, unreadCount: 0 }
          : conv
      ));
      
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
};

  const handleCall = async () => {
    if (!activeConversation || callingState.isCall) return;
    
    const partner = users[activeConversation.partnerId];
    setCallingState(prev => ({ ...prev, isCall: true }));
    
    try {
      toast.info(`Calling ${partner?.displayName || 'Unknown User'}...`);
      
      // Simulate call connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate call connection (random success/failure for demo)
      if (Math.random() > 0.3) {
        toast.success(`Connected to ${partner?.displayName || 'Unknown User'}`);
        // In a real app, this would integrate with WebRTC or calling service
        setTimeout(() => {
          toast.info('Call ended');
        }, 5000);
      } else {
        toast.error(`${partner?.displayName || 'Unknown User'} is unavailable`);
      }
    } catch (error) {
      toast.error('Failed to initiate call');
    } finally {
      setTimeout(() => {
        setCallingState(prev => ({ ...prev, isCall: false }));
      }, 1000);
    }
  };

  const handleVideoCall = async () => {
    if (!activeConversation || callingState.isVideo) return;
    
    const partner = users[activeConversation.partnerId];
    setCallingState(prev => ({ ...prev, isVideo: true }));
    
    try {
      toast.info(`Starting video call with ${partner?.displayName || 'Unknown User'}...`);
      
      // Simulate video call connection delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // Simulate video call connection (random success/failure for demo)
      if (Math.random() > 0.2) {
        toast.success(`Video call connected with ${partner?.displayName || 'Unknown User'}`);
        // In a real app, this would open video calling interface
        setTimeout(() => {
          toast.info('Video call ended');
        }, 8000);
      } else {
        toast.error('Video call failed to connect');
      }
    } catch (error) {
      toast.error('Failed to start video call');
    } finally {
      setTimeout(() => {
        setCallingState(prev => ({ ...prev, isVideo: false }));
      }, 1000);
    }
  };

  const handleMuteConversation = async () => {
    if (!activeConversation) return;
    
    const partner = users[activeConversation.partnerId];
    try {
      // In a real app, this would call API to mute/unmute
      await new Promise(resolve => setTimeout(resolve, 300));
      toast.success(`${partner?.displayName || 'Conversation'} has been muted`);
      setShowOptionsDropdown(false);
    } catch (error) {
      toast.error('Failed to mute conversation');
    }
  };

  const handleArchiveConversation = async () => {
    if (!activeConversation) return;
    
    const partner = users[activeConversation.partnerId];
    try {
      // In a real app, this would call API to archive
      await new Promise(resolve => setTimeout(resolve, 400));
      toast.success(`Conversation with ${partner?.displayName || 'Unknown User'} archived`);
      
      // Remove from conversations list
      setConversations(prev => prev.filter(conv => conv.partnerId !== activeConversation.partnerId));
      setActiveConversation(null);
      setShowOptionsDropdown(false);
    } catch (error) {
      toast.error('Failed to archive conversation');
    }
  };

  const handleDeleteConversation = async () => {
    if (!activeConversation) return;
    
    const partner = users[activeConversation.partnerId];
    const confirmDelete = window.confirm(
      `Are you sure you want to delete your conversation with ${partner?.displayName || 'Unknown User'}? This action cannot be undone.`
    );
    
    if (!confirmDelete) return;
    
    try {
      // In a real app, this would call API to delete
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Conversation deleted');
      
      // Remove from conversations list
      setConversations(prev => prev.filter(conv => conv.partnerId !== activeConversation.partnerId));
      setActiveConversation(null);
      setShowOptionsDropdown(false);
    } catch (error) {
      toast.error('Failed to delete conversation');
    }
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage(prev => prev + emoji);
  };
  if (loading) {
    return (
      <div className="h-full bg-background">
        <div className="container mx-auto px-4 py-6 h-full max-w-6xl">
          <div className="bg-surface rounded-xl border border-surface-200 h-full flex">
            <div className="w-1/3 border-r border-surface-200 p-4">
              <SkeletonLoader type="message" count={5} />
            </div>
            <div className="flex-1 p-4">
              <div className="h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-background">
      <div className="container mx-auto px-4 py-6 h-full max-w-6xl">
        {/* Page Header - Mobile */}
        <div className="md:hidden mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ApperIcon name="MessageCircle" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-surface-900">Messages</h1>
              <p className="text-surface-600">Chat with your connections</p>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-surface-200 h-full flex overflow-hidden">
          {/* Conversations List */}
          <div className={`w-full md:w-1/3 border-r border-surface-200 flex flex-col ${activeConversation ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="p-4 border-b border-surface-200">
              <div className="hidden md:flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <ApperIcon name="MessageCircle" className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-display font-bold text-surface-900">Messages</h1>
                  <p className="text-surface-600 text-sm">Chat with your connections</p>
                </div>
              </div>
              
              <div className="relative">
                <Input
                  placeholder="Search conversations..."
                  icon="Search"
                  className="w-full"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <EmptyState
                  icon="MessageCircle"
                  title="No conversations yet"
                  description="Start messaging with people you follow"
                  className="py-8"
                />
              ) : (
                <div className="space-y-1 p-2">
                  {conversations.map((conversation) => {
                    const partner = users[conversation.partnerId];
                    return (
                      <motion.button
                        key={conversation.partnerId}
                        whileHover={{ backgroundColor: '#f8fafc' }}
                        onClick={() => setActiveConversation(conversation)}
                        className={`w-full p-3 rounded-lg text-left flex items-center space-x-3 transition-colors duration-150 ${
                          activeConversation?.partnerId === conversation.partnerId
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-surface-50'
                        }`}
                      >
                        <Avatar
                          src={partner?.avatar}
                          alt={partner?.displayName}
                          size="md"
                          showOnline={Math.random() > 0.5}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-surface-900 truncate">
                              {partner?.displayName || 'Unknown User'}
                            </p>
                            <span className="text-xs text-surface-500">
                              {formatDistanceToNow(new Date(conversation.lastMessage.createdAt), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-surface-600 truncate">
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                            <span className="text-xs text-white font-medium">
                              {conversation.unreadCount}
                            </span>
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 flex flex-col ${activeConversation ? 'flex' : 'hidden md:flex'}`}>
            {activeConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-surface-200 flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveConversation(null)}
                    className="md:hidden"
                  >
                    <ApperIcon name="ArrowLeft" className="w-5 h-5" />
                  </Button>
                  
                  <Avatar
                    src={users[activeConversation.partnerId]?.avatar}
                    alt={users[activeConversation.partnerId]?.displayName}
                    size="md"
                    showOnline={Math.random() > 0.5}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-surface-900">
                      {users[activeConversation.partnerId]?.displayName || 'Unknown User'}
                    </h3>
                    <p className="text-sm text-success">Online now</p>
                  </div>
                  
<div className="flex space-x-1 relative">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleCall}
                      disabled={callingState.isCall || callingState.isVideo}
                      loading={callingState.isCall}
                      title="Voice call"
                    >
                      <ApperIcon name="Phone" className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleVideoCall}
                      disabled={callingState.isCall || callingState.isVideo}
                      loading={callingState.isVideo}
                      title="Video call"
                    >
                      <ApperIcon name="Video" className="w-5 h-5" />
                    </Button>
                    <div className="relative" ref={optionsDropdownRef}>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowOptionsDropdown(!showOptionsDropdown)}
                        title="More options"
                      >
                        <ApperIcon name="MoreVertical" className="w-5 h-5" />
                      </Button>
                      
                      <AnimatePresence>
                        {showOptionsDropdown && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-surface-200 py-2 z-50"
                          >
                            <button
                              onClick={handleMuteConversation}
                              className="w-full px-4 py-2 text-left text-sm text-surface-700 hover:bg-surface-50 flex items-center space-x-3"
                            >
                              <ApperIcon name="VolumeX" className="w-4 h-4" />
                              <span>Mute conversation</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                toast.info('Search functionality coming soon');
                                setShowOptionsDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-surface-700 hover:bg-surface-50 flex items-center space-x-3"
                            >
                              <ApperIcon name="Search" className="w-4 h-4" />
                              <span>Search in conversation</span>
                            </button>
                            
                            <button
                              onClick={() => {
                                const partner = users[activeConversation.partnerId];
                                toast.info(`Viewing ${partner?.displayName || 'Unknown User'}'s profile`);
                                setShowOptionsDropdown(false);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-surface-700 hover:bg-surface-50 flex items-center space-x-3"
                            >
                              <ApperIcon name="User" className="w-4 h-4" />
                              <span>View profile</span>
                            </button>
                            
                            <div className="border-t border-surface-200 my-2"></div>
                            
                            <button
                              onClick={handleArchiveConversation}
                              className="w-full px-4 py-2 text-left text-sm text-surface-700 hover:bg-surface-50 flex items-center space-x-3"
                            >
                              <ApperIcon name="Archive" className="w-4 h-4" />
                              <span>Archive conversation</span>
                            </button>
                            
                            <button
                              onClick={handleDeleteConversation}
                              className="w-full px-4 py-2 text-left text-sm text-error hover:bg-error/5 flex items-center space-x-3"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                              <span>Delete conversation</span>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {loadingMessages ? (
                    <SkeletonLoader type="message" count={5} />
                  ) : (
                    <AnimatePresence>
                      {messages.map((message, index) => {
                        const isOwn = message.senderId === currentUserId;
                        const sender = users[message.senderId];
                        
                        return (
                          <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isOwn ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                              {!isOwn && (
                                <Avatar
                                  src={sender?.avatar}
                                  alt={sender?.displayName}
                                  size="sm"
                                />
                              )}
                              <div className={`px-4 py-2 rounded-2xl ${
                                isOwn 
                                  ? 'bg-primary text-white' 
                                  : 'bg-surface-100 text-surface-900'
                              }`}>
                                <p className="break-words">{message.content}</p>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
{/* Message Input */}
                <div className="p-4 border-t border-surface-200">
                  <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
                    <div className="flex-1">
                      <Input
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="rounded-full"
                      />
                    </div>
                    <EmojiPicker
                      isOpen={showEmojiPicker}
                      onToggle={setShowEmojiPicker}
                      onEmojiSelect={handleEmojiSelect}
                      position="top-right"
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!newMessage.trim() || sending}
                      loading={sending}
                      className="rounded-full"
                    >
                      <ApperIcon name="Send" className="w-5 h-5" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <EmptyState
                  icon="MessageCircle"
                  title="Select a conversation"
                  description="Choose a conversation from the list to start chatting"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;