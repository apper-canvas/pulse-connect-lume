import postData from '../mockData/posts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class PostService {
  constructor() {
    this.data = [...postData];
  }

  async getAll() {
    await delay(300);
    // Sort by creation date, newest first
    const sorted = [...this.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted;
  }

  async getById(id) {
    await delay(200);
    const post = this.data.find(item => item.id === id);
    return post ? { ...post } : null;
  }

  async getByUserId(userId) {
    await delay(300);
    const userPosts = this.data.filter(post => post.userId === userId);
    const sorted = userPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return [...sorted];
  }

  async getFeedPosts(followingIds) {
    await delay(400);
    const feedPosts = this.data.filter(post => followingIds.includes(post.userId));
    const sorted = feedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return [...sorted];
}

  async getPostsByTopic(topic) {
    await delay(350);
    const topicPosts = this.data.filter(post => {
      const content = post.content.toLowerCase();
      const searchTopic = topic.toLowerCase().replace('#', '');
      return content.includes(searchTopic) || content.includes(topic.toLowerCase());
    });
    const sorted = topicPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return [...sorted];
  }

  async create(postData) {
    await delay(400);
    const newPost = {
      ...postData,
      id: Date.now().toString(),
      likes: [],
      commentsCount: 0,
      createdAt: new Date().toISOString()
    };
    this.data.push(newPost);
    return { ...newPost };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Post not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('Post not found');
    
    this.data.splice(index, 1);
    return true;
  }

  async toggleLike(postId, userId) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === postId);
    if (index === -1) throw new Error('Post not found');
    
    const post = this.data[index];
    const likeIndex = post.likes.indexOf(userId);
    
    if (likeIndex === -1) {
      // Add like
      post.likes.push(userId);
    } else {
      // Remove like
      post.likes.splice(likeIndex, 1);
    }
    
    return { ...post };
  }

  async incrementCommentCount(postId) {
    await delay(200);
    const index = this.data.findIndex(item => item.id === postId);
    if (index === -1) throw new Error('Post not found');
    
    this.data[index].commentsCount += 1;
    return { ...this.data[index] };
  }
}

export default new PostService();