// Authentication Service with Farcaster integration
class AuthManager {
  constructor() {
    this.user = null;
    this.token = null;
    this.isAuthenticated = false;
    this.listeners = new Set();
    
    this.initializeAuth();
  }

  async initializeAuth() {
    // Check for existing token
    const storedToken = storage.get(STORAGE_KEYS.AUTH_TOKEN);
    const storedUser = storage.get(STORAGE_KEYS.USER_PROFILE);
    
    if (storedToken && storedUser) {
      this.token = storedToken;
      this.user = storedUser;
      this.isAuthenticated = true;
      this.updateAuthUI();
    }

    // Initialize Farcaster SDK if available
    this.initializeFarcaster();
  }

  initializeFarcaster() {
    // Mock Farcaster SDK initialization
    if (typeof window !== 'undefined') {
      window.farcaster = {
        isConnected: false,
        user: null,
        
        // Mock SIWF (Sign In With Farcaster)
        signIn: async () => {
          return new Promise((resolve) => {
            setTimeout(() => {
              const mockUser = {
                fid: Math.floor(Math.random() * 1000000),
                username: 'mockuser',
                displayName: 'Mock User',
                avatar: 'https://picsum.photos/100/100',
                pfpUrl: 'https://picsum.photos/100/100'
              };
              
              window.farcaster.isConnected = true;
              window.farcaster.user = mockUser;
              
              resolve({
                success: true,
                user: mockUser,
                signature: 'mock_signature',
                message: 'mock_message'
              });
            }, 1000);
          });
        },

        // Mock SDK actions
        cast: async (text, embeds = []) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({
                success: true,
                hash: 'mock_cast_hash',
                url: `https://warpcast.com/mockuser/cast-hash`
              });
            }, 500);
          });
        },

        share: async (url, text) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              resolve({ success: true });
            }, 500);
          });
        }
      };
    }
  }

  async signInWithFarcaster() {
    try {
      if (!window.farcaster) {
        throw new Error('Farcaster SDK not available');
      }

      // Show loading state
      const authButton = document.getElementById('authButton');
      if (authButton) {
        authButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
        authButton.disabled = true;
      }

      // Initiate SIWF flow
      const farcasterResult = await window.farcaster.signIn();
      
      if (!farcasterResult.success) {
        throw new Error('Farcaster authentication failed');
      }

      // Send signature to backend for JWT
      const authResult = await apiClient.post(API_ENDPOINTS.AUTH, {
        fid: farcasterResult.user.fid,
        username: farcasterResult.user.username,
        signature: farcasterResult.signature,
        message: farcasterResult.message
      });

      if (!authResult.success) {
        throw new Error('Backend authentication failed');
      }

      // Store auth data
      this.token = authResult.data.token;
      this.user = {
        ...farcasterResult.user,
        isAdmin: authResult.data.user.isAdmin || false,
        badges: authResult.data.user.badges || [],
        stats: authResult.data.user.stats || {}
      };
      this.isAuthenticated = true;

      // Persist to storage
      storage.set(STORAGE_KEYS.AUTH_TOKEN, this.token);
      storage.set(STORAGE_KEYS.USER_PROFILE, this.user);

      // Update UI
      this.updateAuthUI();
      
      // Notify listeners
      this.notifyListeners('login', this.user);

      // Show success
      toast.success(`Welcome back, ${this.user.displayName}!`);

      // Track analytics
      analytics.track('user_login', {
        fid: this.user.fid,
        method: 'farcaster'
      });

      return { success: true, user: this.user };

    } catch (error) {
      console.error('Authentication error:', error);
      
      // Reset loading state
      this.updateAuthUI();
      
      // Show error
      toast.error(error.message || 'Authentication failed');
      
      return { success: false, error: error.message };
    }
  }

  async signInQuick() {
    // Quick auth for demo purposes
    try {
      const authButton = document.getElementById('authButton');
      if (authButton) {
        authButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        authButton.disabled = true;
      }

      // Simulate quick auth
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUser = {
        fid: 12345,
        username: 'demouser',
        displayName: 'Demo User',
        avatar: 'https://picsum.photos/100/100',
        isAdmin: Math.random() > 0.8,
        badges: ['EARLY_ADOPTER'],
        stats: {
          appsLaunched: 3,
          cohortsJoined: 2,
          referrals: 5
        }
      };

      this.token = 'demo_jwt_token';
      this.user = mockUser;
      this.isAuthenticated = true;

      storage.set(STORAGE_KEYS.AUTH_TOKEN, this.token);
      storage.set(STORAGE_KEYS.USER_PROFILE, this.user);

      this.updateAuthUI();
      this.notifyListeners('login', this.user);

      toast.success(`Welcome, ${this.user.displayName}!`);

      analytics.track('user_login', {
        fid: this.user.fid,
        method: 'quick'
      });

      return { success: true, user: this.user };

    } catch (error) {
      this.updateAuthUI();
      toast.error('Quick sign in failed');
      return { success: false, error: error.message };
    }
  }

  logout() {
    // Clear auth data
    this.token = null;
    this.user = null;
    this.isAuthenticated = false;

    // Clear storage
    storage.remove(STORAGE_KEYS.AUTH_TOKEN);
    storage.remove(STORAGE_KEYS.USER_PROFILE);

    // Update UI
    this.updateAuthUI();

    // Notify listeners
    this.notifyListeners('logout');

    // Show message
    toast.info('Signed out successfully');

    // Track analytics
    analytics.track('user_logout');

    // Disconnect Farcaster if connected
    if (window.farcaster?.isConnected) {
      window.farcaster.isConnected = false;
      window.farcaster.user = null;
    }
  }

  updateAuthUI() {
    const authButton = document.getElementById('authButton');
    if (!authButton) return;

    if (this.isAuthenticated && this.user) {
      authButton.innerHTML = `
        <img src="${this.user.avatar}" alt="Profile" class="auth-avatar">
        <span>${this.user.displayName}</span>
        <i class="fas fa-chevron-down" aria-hidden="true"></i>
      `;
      authButton.onclick = () => this.showUserMenu();
      authButton.disabled = false;
      
      // Show admin menu if user is admin
      this.updateAdminMenu();
    } else {
      authButton.innerHTML = `
        <i class="fas fa-user" aria-hidden="true"></i>
        <span>Sign In</span>
      `;
      authButton.onclick = () => this.showSignInOptions();
      authButton.disabled = false;
    }
  }

  updateAdminMenu() {
    const navMenu = document.getElementById('navMenu');
    if (!navMenu) return;

    // Remove existing admin link
    const existingAdminLink = navMenu.querySelector('[data-page="admin"]');
    if (existingAdminLink) {
      existingAdminLink.remove();
    }

    // Add admin link if user is admin
    if (this.user?.isAdmin) {
      const adminLink = document.createElement('a');
      adminLink.href = '#admin';
      adminLink.className = 'nav-link';
      adminLink.setAttribute('data-page', 'admin');
      adminLink.setAttribute('aria-label', 'Admin panel');
      adminLink.innerHTML = `
        <i class="fas fa-shield" aria-hidden="true"></i>
        <span>Admin</span>
      `;
      navMenu.appendChild(adminLink);
    }
  }

  showSignInOptions() {
    modal.open({
      title: 'Sign In to Base Launch',
      content: `
        <div class="auth-options">
          <p>Choose your preferred sign-in method:</p>
          <div class="auth-buttons">
            <button class="btn btn-primary auth-option" onclick="authManager.signInWithFarcaster()">
              <i class="fas fa-signature" aria-hidden="true"></i>
              Sign in with Farcaster
            </button>
            <button class="btn btn-secondary auth-option" onclick="authManager.signInQuick()">
              <i class="fas fa-bolt" aria-hidden="true"></i>
              Quick Demo Sign In
            </button>
          </div>
          <p class="auth-note">
            Sign in to save apps, join waitlists, and participate in launch cohorts.
          </p>
        </div>
      `,
      size: 'medium'
    });
  }

  showUserMenu() {
    const badges = this.user.badges?.map(badge => 
      `<span class="badge badge-primary">${USER_BADGES[badge]?.icon} ${USER_BADGES[badge]?.name}</span>`
    ).join('') || '<span class="badge badge-secondary">No badges yet</span>';

    modal.open({
      title: 'User Profile',
      content: `
        <div class="user-profile">
          <div class="profile-header">
            <img src="${this.user.avatar}" alt="Profile" class="profile-avatar">
            <div class="profile-info">
              <h3>${this.user.displayName}</h3>
              <p>@${this.user.username}</p>
              <p>FID: ${this.user.fid}</p>
            </div>
          </div>
          
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-number">${this.user.stats?.appsLaunched || 0}</span>
              <span class="stat-label">Apps Launched</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${this.user.stats?.cohortsJoined || 0}</span>
              <span class="stat-label">Cohorts Joined</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">${this.user.stats?.referrals || 0}</span>
              <span class="stat-label">Referrals</span>
            </div>
          </div>
          
          <div class="profile-badges">
            <h4>Badges</h4>
            <div class="badges-list">${badges}</div>
          </div>
          
          <div class="profile-actions">
            <button class="btn btn-primary" onclick="authManager.shareProfile()">
              <i class="fas fa-share" aria-hidden="true"></i>
              Share Profile
            </button>
            <button class="btn btn-secondary" onclick="authManager.logout(); modal.close()">
              <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
              Sign Out
            </button>
          </div>
        </div>
      `,
      size: 'medium'
    });
  }

  async shareProfile() {
    if (!window.farcaster?.share) {
      toast.warning('Sharing not available');
      return;
    }

    const shareText = `Check out my Base Launch profile! I've launched ${this.user.stats?.appsLaunched || 0} apps and joined ${this.user.stats?.cohortsJoined || 0} cohorts.`;
    const shareUrl = `${APP_CONFIG.FARCASTER_APP_URL}/profile/${this.user.fid}`;

    try {
      await window.farcaster.share(shareUrl, shareText);
      toast.success('Profile shared successfully!');
      modal.close();
    } catch (error) {
      toast.error('Failed to share profile');
    }
  }

  // Event listeners
  onAuthChange(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Auth listener error:', error);
      }
    });
  }

  // JWT utilities
  isTokenExpired() {
    if (!this.token) return true;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  async refreshTokenIfNeeded() {
    if (!this.isAuthenticated || !this.isTokenExpired()) return;

    try {
      const result = await apiClient.post('/api/auth/refresh', {
        token: this.token
      });

      if (result.success) {
        this.token = result.data.token;
        storage.set(STORAGE_KEYS.AUTH_TOKEN, this.token);
      } else {
        this.logout();
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
    }
  }
}

// Add auth styles
const authStyles = `
<style>
.auth-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

.auth-options {
  text-align: center;
}

.auth-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.auth-option {
  justify-content: center;
}

.auth-note {
  font-size: 0.875rem;
  color: var(--gray-600);
  margin-top: 1rem;
}

.user-profile {
  max-width: 500px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.profile-info h3 {
  margin: 0 0 0.25rem 0;
  font-size: 1.25rem;
}

.profile-info p {
  margin: 0;
  color: var(--gray-600);
  font-size: 0.875rem;
}

.profile-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: var(--gray-50);
  border-radius: var(--border-radius);
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.profile-badges h4 {
  margin: 0 0 0.75rem 0;
  font-size: 1rem;
}

.badges-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.profile-actions {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-stats {
    grid-template-columns: 1fr;
  }
  
  .profile-actions {
    flex-direction: column;
  }
}
</style>
`;

// Inject styles
document.head.insertAdjacentHTML('beforeend', authStyles);

// Initialize global auth manager
const authManager = new AuthManager();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AuthManager };
}