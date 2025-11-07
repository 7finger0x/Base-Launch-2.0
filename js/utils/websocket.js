// Simulated WebSocket for real-time updates
class SimulatedWebSocket {
  constructor() {
    this.isConnected = false;
    this.listeners = new Map();
    this.retryCount = 0;
    this.maxRetries = 5;
    this.retryInterval = APP_CONFIG.WEBSOCKET_RETRY_INTERVAL;
    this.updateInterval = null;
    this.metricsInterval = null;
  }

  connect() {
    if (this.isConnected) return;

    try {
      this.isConnected = true;
      this.retryCount = 0;
      
      // Simulate connection success
      this.emit('connected', { timestamp: Date.now() });
      
      // Start metric updates
      this.startMetricUpdates();
      
      toast.show('Connected to live updates', 'success');
    } catch (error) {
      this.handleConnectionError(error);
    }
  }

  disconnect() {
    this.isConnected = false;
    this.stopMetricUpdates();
    this.emit('disconnected', { timestamp: Date.now() });
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('WebSocket event handler error:', error);
        }
      });
    }
  }

  startMetricUpdates() {
    // Simulate real-time metric updates
    this.metricsInterval = setInterval(() => {
      if (!this.isConnected) return;

      const updates = this.generateMetricUpdates();
      this.emit('metrics_update', updates);
    }, 5000);

    // Simulate occasional app updates
    this.updateInterval = setInterval(() => {
      if (!this.isConnected) return;

      if (Math.random() > 0.7) {
        const update = this.generateAppUpdate();
        this.emit('app_update', update);
      }

      if (Math.random() > 0.8) {
        const launch = this.generateLaunchUpdate();
        this.emit('launch_update', launch);
      }
    }, 10000);
  }

  stopMetricUpdates() {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
    
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  generateMetricUpdates() {
    return {
      totalApps: Math.floor(Math.random() * 5) + 118,
      activeLaunches: Math.floor(Math.random() * 3) + 13,
      developers: Math.floor(Math.random() * 100) + 2450,
      timestamp: Date.now()
    };
  }

  generateAppUpdate() {
    const actions = ['new_app', 'rating_update', 'download_milestone'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    return {
      type: action,
      appId: Math.floor(Math.random() * 120) + 1,
      data: this.generateUpdateData(action),
      timestamp: Date.now()
    };
  }

  generateLaunchUpdate() {
    const actions = ['waitlist_milestone', 'launch_date_update', 'cohort_formed'];
    const action = actions[Math.floor(Math.random() * actions.length)];
    
    return {
      type: action,
      launchId: Math.floor(Math.random() * 15) + 1,
      data: this.generateUpdateData(action),
      timestamp: Date.now()
    };
  }

  generateUpdateData(action) {
    switch (action) {
      case 'new_app':
        return { message: 'New app approved!' };
      case 'rating_update':
        return { 
          newRating: Number((Math.random() * 2 + 3).toFixed(1)),
          message: 'Rating updated' 
        };
      case 'download_milestone':
        return { 
          downloads: Math.floor(Math.random() * 100000),
          message: 'Download milestone reached!' 
        };
      case 'waitlist_milestone':
        return { 
          waitlistCount: Math.floor(Math.random() * 1000) + 1000,
          message: 'Waitlist milestone reached!' 
        };
      case 'launch_date_update':
        return { 
          newDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
          message: 'Launch date updated' 
        };
      case 'cohort_formed':
        return { message: 'New cohort formed!' };
      default:
        return { message: 'Update received' };
    }
  }

  handleConnectionError(error) {
    this.isConnected = false;
    
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      
      toast.show(`Connection lost. Retrying... (${this.retryCount}/${this.maxRetries})`, 'warning');
      
      setTimeout(() => {
        this.connect();
      }, this.retryInterval * this.retryCount);
    } else {
      toast.show('Unable to connect to live updates', 'error');
      this.emit('max_retries_exceeded', { error });
    }
  }

  // Simulate sending data
  send(data) {
    if (!this.isConnected) {
      throw new Error('WebSocket not connected');
    }
    
    // In a real implementation, this would send data to the server
    console.log('Simulated WebSocket send:', data);
    
    // Simulate server response
    setTimeout(() => {
      this.emit('response', { 
        success: true, 
        requestId: data.id,
        timestamp: Date.now() 
      });
    }, Math.random() * 1000);
  }
}

// Initialize WebSocket connection
const websocket = new SimulatedWebSocket();

// Auto-connect when online
window.addEventListener('online', () => {
  if (!websocket.isConnected) {
    websocket.connect();
  }
});

// Disconnect when offline
window.addEventListener('offline', () => {
  websocket.disconnect();
});

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SimulatedWebSocket };
}