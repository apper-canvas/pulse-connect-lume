import userData from '../mockData/users.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class UserService {
  constructor() {
    this.data = [...userData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const user = this.data.find(item => item.id === id);
    return user ? { ...user } : null;
  }

  async getByUsername(username) {
    await delay(200);
    const user = this.data.find(item => item.username === username);
    return user ? { ...user } : null;
  }

  async getCurrentUser() {
    await delay(200);
    // Return first user as current user for demo
    return this.data[0] ? { ...this.data[0] } : null;
  }

  async searchUsers(query) {
    await delay(300);
    const filtered = this.data.filter(user => 
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.displayName.toLowerCase().includes(query.toLowerCase())
    );
    return [...filtered];
  }

  async create(userData) {
    await delay(400);
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      followersCount: 0,
      followingCount: 0,
      postsCount: 0,
      createdAt: new Date().toISOString()
    };
    this.data.push(newUser);
    return { ...newUser };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('User not found');
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('User not found');
    
    this.data.splice(index, 1);
    return true;
  }

  async updateFollowCounts(userId, followingDelta, followerUserId, followerDelta) {
    await delay(200);
    
    // Update following count for main user
    const userIndex = this.data.findIndex(item => item.id === userId);
    if (userIndex !== -1) {
      this.data[userIndex].followingCount += followingDelta;
    }
    
    // Update follower count for target user
    const followerIndex = this.data.findIndex(item => item.id === followerUserId);
    if (followerIndex !== -1) {
      this.data[followerIndex].followersCount += followerDelta;
    }
return true;
  }
  
  async updateBio(id, bioData) {
    await delay(400);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('User not found');
    
    const updates = {
      bio: bioData.bio || '',
      website: bioData.website || '',
      location: bioData.location || '',
      displayName: bioData.displayName || this.data[index].displayName
    };
    
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }
  
async updateAvatar(id, avatarInput) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) throw new Error('User not found');
    
    let avatarUrl = avatarInput;
    
// Handle File object upload
    if (typeof File !== 'undefined' && avatarInput instanceof File) {
      // Validate file type
      if (!avatarInput.type.startsWith('image/')) {
        throw new Error('Invalid file type. Please select an image file.');
      }
      
      // Validate file size (5MB limit)
      if (avatarInput.size > 5 * 1024 * 1024) {
        throw new Error('File size too large. Please select an image under 5MB.');
      }
      
      // Convert to base64 for persistence
      avatarUrl = await this.fileToBase64(avatarInput);
    }
    
    this.data[index] = { ...this.data[index], avatar: avatarUrl };
    return { ...this.data[index] };
  }
  
// Helper method to convert File to base64
  async fileToBase64(file) {
    if (typeof FileReader === 'undefined') {
      throw new Error('FileReader is not available in this environment');
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }
}

export default new UserService();