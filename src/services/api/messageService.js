import messageData from '../mockData/messages.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MessageService {
  constructor() {
    this.data = [...messageData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const message = this.data.find(item => item.id === id);
    return message ? { ...message } : null;
  }

  async getConversation(userId1, userId2) {
    await delay(300);
    const conversation = this.data.filter(message => 
      (message.senderId === userId1 && message.receiverId === userId2) ||
      (message.senderId === userId2 && message.receiverId === userId1)
    );
    const sorted = conversation.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return [...sorted];
  }

  async getConversations(userId) {
    await delay(400);
    const userMessages = this.data.filter(message => 
      message.senderId === userId || message.receiverId === userId
    );
    
    // Group by conversation partner
    const conversations = {};
    userMessages.forEach(message => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
      if (!conversations[partnerId]) {
        conversations[partnerId] = [];
      }
      conversations[partnerId].push(message);
    });
    
    // Get latest message for each conversation
    const conversationList = Object.keys(conversations).map(partnerId => {
      const messages = conversations[partnerId].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      return {
        partnerId,
        lastMessage: messages[0],
        unreadCount: messages.filter(msg => msg.receiverId === userId && !msg.read).length
      };
    });
    
    return conversationList.sort((a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt));
  }

  async create(messageData) {
    await delay(400);
    const newMessage = {
      ...messageData,
      id: Date.now().toString(),
      read: false,
      createdAt: new Date().toISOString()
    };
    this.data.push(newMessage);
    return { ...newMessage };
  }

  async markAsRead(id) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Message not found');
    
    this.data[index].read = true;
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Message not found');
    
    this.data.splice(index, 1);
    return true;
  }
}

export default new MessageService();