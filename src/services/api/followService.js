import followData from '../mockData/follows.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FollowService {
  constructor() {
    this.data = [...followData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getFollowers(userId) {
    await delay(300);
    const followers = this.data.filter(follow => follow.followingId === userId);
    return [...followers];
  }

  async getFollowing(userId) {
    await delay(300);
    const following = this.data.filter(follow => follow.followerId === userId);
    return [...following];
  }

  async getFollowingIds(userId) {
    await delay(200);
    const following = this.data.filter(follow => follow.followerId === userId);
    return following.map(follow => follow.followingId);
  }

  async isFollowing(followerId, followingId) {
    await delay(200);
    const follow = this.data.find(f => f.followerId === followerId && f.followingId === followingId);
    return !!follow;
  }

  async create(followData) {
    await delay(400);
    const newFollow = {
      ...followData,
      createdAt: new Date().toISOString()
    };
    this.data.push(newFollow);
    return { ...newFollow };
  }

  async delete(followerId, followingId) {
    await delay(300);
    const index = this.data.findIndex(item => 
      item.followerId === followerId && item.followingId === followingId
    );
    if (index === -1) throw new Error('Follow relationship not found');
    
    this.data.splice(index, 1);
    return true;
  }

  async toggleFollow(followerId, followingId) {
    await delay(300);
    const existingIndex = this.data.findIndex(item => 
      item.followerId === followerId && item.followingId === followingId
    );
    
    if (existingIndex === -1) {
      // Create follow
      const newFollow = {
        followerId,
        followingId,
        createdAt: new Date().toISOString()
      };
      this.data.push(newFollow);
      return { action: 'followed', follow: newFollow };
    } else {
      // Remove follow
      this.data.splice(existingIndex, 1);
      return { action: 'unfollowed' };
    }
  }
}

export default new FollowService();