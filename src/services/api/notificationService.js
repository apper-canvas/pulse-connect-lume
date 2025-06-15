import notificationData from '../mockData/notifications.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class NotificationService {
  constructor() {
    this.data = [...notificationData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const notification = this.data.find(item => item.id === id);
    return notification ? { ...notification } : null;
  }

  async getByUserId(userId) {
    await delay(300);
    const userNotifications = this.data.filter(notification => notification.userId === userId);
    const sorted = userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return [...sorted];
  }

  async getUnreadCount(userId) {
    await delay(200);
    const userNotifications = this.data.filter(notification => 
      notification.userId === userId && !notification.isRead
    );
    return userNotifications.length;
  }

  async create(notificationData) {
    await delay(400);
    
    // Check if there's an existing notification of the same type for grouping
    const existingIndex = this.data.findIndex(notification => 
      notification.userId === notificationData.userId &&
      notification.type === notificationData.type &&
      notification.postId === notificationData.postId &&
      !notification.isRead
    );

    if (existingIndex !== -1 && notificationData.type !== 'follow') {
      // Update existing notification by adding actor and incrementing count
      const existing = this.data[existingIndex];
      if (!existing.actorIds.includes(notificationData.actorId)) {
        existing.actorIds.unshift(notificationData.actorId);
        existing.groupCount = existing.actorIds.length;
        existing.createdAt = new Date().toISOString();
        return { ...existing };
      }
      return { ...existing };
    }

    // Create new notification
    const newNotification = {
      ...notificationData,
      id: Date.now().toString(),
      actorIds: [notificationData.actorId],
      groupCount: 1,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    delete newNotification.actorId; // Remove single actorId in favor of actorIds array
    this.data.unshift(newNotification);
    return { ...newNotification };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Notification not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Notification not found');
    
    this.data.splice(index, 1);
    return true;
  }

  async markAsRead(id) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Notification not found');
    
    this.data[index].isRead = true;
    return { ...this.data[index] };
  }

  async markAllAsRead(userId) {
    await delay(300);
    const updated = [];
    this.data.forEach(notification => {
      if (notification.userId === userId && !notification.isRead) {
        notification.isRead = true;
        updated.push({ ...notification });
      }
    });
    return updated;
  }
}

export default new NotificationService();