import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Avatar from '@/components/atoms/Avatar';
import ApperIcon from '@/components/ApperIcon';
import { userService } from '@/services';
import { useState, useEffect } from 'react';

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const [actors, setActors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActors();
  }, [notification.actorIds]);

  const loadActors = async () => {
    try {
      setLoading(true);
      const actorPromises = notification.actorIds.slice(0, 3).map(id => 
        userService.getById(id)
      );
      const actorData = await Promise.all(actorPromises);
      setActors(actorData.filter(Boolean));
    } catch (error) {
      console.error('Failed to load notification actors:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = () => {
    switch (notification.type) {
      case 'like':
        return <ApperIcon name="Heart" className="w-4 h-4 text-red-500" />;
      case 'comment':
        return <ApperIcon name="MessageCircle" className="w-4 h-4 text-blue-500" />;
      case 'follow':
        return <ApperIcon name="UserPlus" className="w-4 h-4 text-green-500" />;
      default:
        return <ApperIcon name="Bell" className="w-4 h-4 text-surface-500" />;
    }
  };

  const getNotificationText = () => {
    if (loading) return 'Loading...';
    
    const firstActor = actors[0];
    if (!firstActor) return notification.message;

    if (notification.groupCount === 1) {
      return `${firstActor.displayName} ${notification.message}`;
    } else if (notification.groupCount === 2) {
      const secondActor = actors[1];
      return `${firstActor.displayName} and ${secondActor?.displayName || 'someone else'} ${notification.message}`;
    } else {
      const othersCount = notification.groupCount - 1;
      return `${firstActor.displayName} and ${othersCount} ${othersCount === 1 ? 'other' : 'others'} ${notification.message}`;
    }
  };

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center space-x-3 p-3 animate-pulse">
        <div className="w-10 h-10 bg-surface-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-surface-200 rounded w-3/4"></div>
          <div className="h-3 bg-surface-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
      onClick={handleClick}
      className={`flex items-start space-x-3 p-3 cursor-pointer transition-colors duration-200 ${
        !notification.isRead ? 'bg-primary/5 border-l-2 border-primary' : ''
      }`}
    >
      {/* Actor Avatars */}
      <div className="relative flex-shrink-0">
        {actors.length > 0 && (
          <div className="relative">
            <Avatar
              src={actors[0].avatar}
              alt={actors[0].displayName}
              size="md"
            />
            {actors.length > 1 && (
              <div className="absolute -bottom-1 -right-1">
                <Avatar
                  src={actors[1].avatar}
                  alt={actors[1].displayName}
                  size="sm"
                  className="border-2 border-white"
                />
              </div>
            )}
            {notification.groupCount > 2 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                +{notification.groupCount - 2}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Notification Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-sm break-words ${
              !notification.isRead ? 'font-medium text-surface-900' : 'text-surface-700'
            }`}>
              {getNotificationText()}
            </p>
            <p className="text-xs text-surface-500 mt-1">
              {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
            </p>
          </div>
          
          <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
            {getNotificationIcon()}
            {!notification.isRead && (
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NotificationItem;