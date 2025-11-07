// API Client with timeout and retry logic
class APIClient {
  constructor() {
    this.baseURL = window.location.origin;
    this.timeout = APP_CONFIG.API_TIMEOUT;
    this.maxRetries = APP_CONFIG.MAX_RETRY_ATTEMPTS;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    // Add auth token if available
    const token = storage.get(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    let lastError;
    
    for (let attempt = 0; attempt <= this.maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        return { success: true, data };

      } catch (error) {
        lastError = error;
        
        if (error.name === 'AbortError') {
          lastError = new Error(ERROR_MESSAGES.TIMEOUT_ERROR);
        }

        // Don't retry on auth errors
        if (error.message.includes('401') || error.message.includes('403')) {
          this.handleAuthError();
          break;
        }

        // Wait before retry
        if (attempt < this.maxRetries) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    return { 
      success: false, 
      error: lastError.message || ERROR_MESSAGES.UNKNOWN_ERROR 
    };
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { method: 'GET', ...options });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...options
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      method: 'PUT', 
      body: JSON.stringify(data),
      ...options
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { method: 'DELETE', ...options });
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  handleAuthError() {
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    if (window.authManager) {
      window.authManager.logout();
    }
    toast.show('Session expired. Please sign in again.', 'error');
  }

  // Check network connectivity
  isOnline() {
    return navigator.onLine;
  }

  // Queue requests for offline mode
  queueOfflineAction(action) {
    const queue = storage.get(STORAGE_KEYS.OFFLINE_ACTIONS, []);
    queue.push({
      ...action,
      timestamp: Date.now(),
      id: Math.random().toString(36).substr(2, 9)
    });
    storage.set(STORAGE_KEYS.OFFLINE_ACTIONS, queue);
  }

  // Process queued actions when back online
  async processOfflineQueue() {
    if (!this.isOnline()) return;

    const queue = storage.get(STORAGE_KEYS.OFFLINE_ACTIONS, []);
    if (queue.length === 0) return;

    const results = [];
    for (const action of queue) {
      try {
        const result = await this.request(action.endpoint, action.options);
        results.push({ ...action, result });
      } catch (error) {
        console.error('Failed to process offline action:', error);
      }
    }

    // Clear processed actions
    storage.remove(STORAGE_KEYS.OFFLINE_ACTIONS);
    
    if (results.length > 0) {
      toast.show(`Synced ${results.length} offline actions`, 'success');
    }

    return results;
  }
}

// Mock API for development
class MockAPIClient extends APIClient {
  constructor() {
    super();
    this.mockData = this.generateMockData();
  }

  generateMockData() {
    return {
      apps: this.generateMockApps(120),
      launches: this.generateMockLaunches(15),
      cohorts: this.generateMockCohorts(8),
      users: this.generateMockUsers(2500)
    };
  }

  generateMockApps(count) {
    const apps = [];
    for (let i = 1; i <= count; i++) {
      apps.push({
        id: i,
        name: `App ${i}`,
        description: `Innovative ${this.randomCategory()} application that revolutionizes user experience with cutting-edge technology and seamless integration.`,
        category: this.randomCategory(),
        rating: Number((Math.random() * 2 + 3).toFixed(1)),
        downloads: Math.floor(Math.random() * 100000),
        image: `https://picsum.photos/400/300?random=${i}`,
        trending: Math.random() > 0.7,
        featured: Math.random() > 0.8,
        status: 'approved',
        createdAt: this.randomDate(),
        updatedAt: new Date().toISOString(),
        developer: `Developer ${Math.floor(Math.random() * 50) + 1}`,
        version: '1.0.0',
        size: Math.floor(Math.random() * 50) + 1 + 'MB',
        tags: this.randomTags()
      });
    }
    return apps;
  }

  generateMockLaunches(count) {
    const launches = [];
    for (let i = 1; i <= count; i++) {
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + Math.floor(Math.random() * 60));
      
      launches.push({
        id: i,
        name: `Launch ${i}`,
        description: `Exciting new ${this.randomCategory()} app launching soon with revolutionary features.`,
        category: this.randomCategory(),
        launchDate: launchDate.toISOString(),
        waitlistCount: Math.floor(Math.random() * 10000),
        referralCode: this.generateReferralCode(),
        image: `https://picsum.photos/500/400?random=${i + 100}`,
        developer: `Developer ${Math.floor(Math.random() * 50) + 1}`,
        targetUsers: Math.floor(Math.random() * 50000) + 10000,
        features: this.randomFeatures(),
        rewards: this.randomRewards()
      });
    }
    return launches;
  }

  generateMockCohorts(count) {
    const cohorts = [];
    for (let i = 1; i <= count; i++) {
      const launchTarget = new Date();
      launchTarget.setDate(launchTarget.getDate() + Math.floor(Math.random() * 30));
      
      cohorts.push({
        id: i,
        name: `Cohort ${i}`,
        description: `Collaborative launch group focused on ${this.randomCategory()} applications.`,
        category: this.randomCategory(),
        members: Math.floor(Math.random() * 20) + 3,
        maxMembers: Math.floor(Math.random() * 20) + 25,
        launchTarget: launchTarget.toISOString(),
        leader: `Leader ${Math.floor(Math.random() * 10) + 1}`,
        status: 'active',
        created: this.randomDate(),
        goals: this.randomGoals()
      });
    }
    return cohorts;
  }

  generateMockUsers(count) {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      fid: Math.floor(Math.random() * 1000000),
      username: `user${i + 1}`,
      displayName: `User ${i + 1}`,
      avatar: `https://picsum.photos/100/100?random=${i}`,
      badges: this.randomBadges(),
      joinedAt: this.randomDate(),
      stats: {
        appsLaunched: Math.floor(Math.random() * 10),
        cohortsJoined: Math.floor(Math.random() * 5),
        referrals: Math.floor(Math.random() * 20)
      }
    }));
  }

  randomCategory() {
    return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  }

  randomDate() {
    const start = new Date();
    start.setMonth(start.getMonth() - 6);
    const end = new Date();
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
  }

  randomTags() {
    const allTags = ['innovative', 'user-friendly', 'secure', 'fast', 'reliable', 'feature-rich'];
    return allTags.slice(0, Math.floor(Math.random() * 3) + 1);
  }

  randomFeatures() {
    const features = ['Real-time updates', 'Cross-platform', 'Secure encryption', 'AI-powered', 'Decentralized'];
    return features.slice(0, Math.floor(Math.random() * 3) + 2);
  }

  randomRewards() {
    return ['Early access', 'Exclusive NFT', 'Token rewards', 'Premium features'][Math.floor(Math.random() * 4)];
  }

  randomGoals() {
    return ['10K users', 'App Store feature', 'Media coverage', 'Partnership deals'][Math.floor(Math.random() * 4)];
  }

  randomBadges() {
    const badges = Object.keys(USER_BADGES);
    return badges.filter(() => Math.random() > 0.7);
  }

  generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  // Override request method to return mock data
  async request(endpoint, options = {}) {
    // Simulate network delay
    await this.delay(Math.random() * 1000 + 200);

    // Simulate occasional failures
    if (Math.random() < 0.05) {
      return { 
        success: false, 
        error: ERROR_MESSAGES.NETWORK_ERROR 
      };
    }

    try {
      let data;
      
      if (endpoint.includes('/apps')) {
        data = this.mockData.apps;
      } else if (endpoint.includes('/launches')) {
        data = this.mockData.launches;
      } else if (endpoint.includes('/cohorts')) {
        data = this.mockData.cohorts;
      } else if (endpoint.includes('/auth')) {
        data = this.handleMockAuth(options);
      } else {
        data = { message: 'Mock response' };
      }

      return { success: true, data };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || ERROR_MESSAGES.UNKNOWN_ERROR 
      };
    }
  }

  handleMockAuth(options) {
    if (options.method === 'POST') {
      // Mock successful authentication
      return {
        token: 'mock_jwt_token',
        user: {
          fid: 12345,
          username: 'mockuser',
          displayName: 'Mock User',
          avatar: 'https://picsum.photos/100/100',
          isAdmin: Math.random() > 0.8
        }
      };
    }
    return { message: 'Auth endpoint' };
  }
}

// Initialize API client
const apiClient = new MockAPIClient();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APIClient, MockAPIClient };
}