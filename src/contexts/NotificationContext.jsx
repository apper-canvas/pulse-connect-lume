import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { notificationService } from '@/services';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const currentUserId = '1'; // Demo current user

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const [userNotifications, unreadTotal] = await Promise.all([
        notificationService.getByUserId(currentUserId),
        notificationService.getUnreadCount(currentUserId)
      ]);
      
      setNotifications(userNotifications);
      setUnreadCount(unreadTotal);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const addNotification = async (notificationData) => {
    try {
      const newNotification = await notificationService.create({
        ...notificationData,
        userId: currentUserId
      });
      
      // Update local state
      setNotifications(prev => {
        const existingIndex = prev.findIndex(n => n.id === newNotification.id);
        if (existingIndex !== -1) {
          // Update existing notification
          const updated = [...prev];
          updated[existingIndex] = newNotification;
          return updated;
        } else {
          // Add new notification
          return [newNotification, ...prev];
        }
      });
      
      setUnreadCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true }
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      toast.success('Notification marked as read');
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead(currentUserId);
      
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, isRead: true }))
      );
      
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      toast.error('Failed to mark all notifications as read');
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    addNotification,
    markAsRead,
    markAllAsRead,
    refresh: loadNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};