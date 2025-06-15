import commentData from '../mockData/comments.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CommentService {
  constructor() {
    this.data = [...commentData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const comment = this.data.find(item => item.id === id);
    return comment ? { ...comment } : null;
  }

  async getByPostId(postId) {
    await delay(300);
    const postComments = this.data.filter(comment => comment.postId === postId);
    const sorted = postComments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    return [...sorted];
  }

  async create(commentData) {
    await delay(400);
    const newComment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    this.data.push(newComment);
    return { ...newComment };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Comment not found');
    
this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async toggleLike(commentId, userId) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === commentId);
    if (index === -1) throw new Error('Comment not found');
    
    const comment = this.data[index];
    const likes = comment.likes || [];
    const isLiked = likes.includes(userId);
    
    if (isLiked) {
      comment.likes = likes.filter(id => id !== userId);
    } else {
      comment.likes = [...likes, userId];
    }
    
    this.data[index] = { ...comment };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Comment not found');
    
    this.data.splice(index, 1);
    return true;
  }
}

export default new CommentService();