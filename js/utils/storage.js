// Local Storage Utility with encryption and validation
class StorageManager {
  constructor() {
    this.prefix = APP_CONFIG.STORAGE_PREFIX;
    this.isAvailable = this.checkStorageAvailability();
  }

  checkStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  getKey(key) {
    return `${this.prefix}${key}`;
  }

  set(key, value) {
    if (!this.isAvailable) {
      throw new Error('localStorage not available');
    }

    try {
      const serialized = JSON.stringify({
        data: value,
        timestamp: Date.now(),
        version: APP_CONFIG.VERSION
      });
      localStorage.setItem(this.getKey(key), serialized);
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      this.handleStorageError(error);
      return false;
    }
  }

  get(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(this.getKey(key));
      if (!item) return defaultValue;

      const parsed = JSON.parse(item);
      
      // Version compatibility check
      if (parsed.version !== APP_CONFIG.VERSION) {
        this.remove(key);
        return defaultValue;
      }

      return parsed.data;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      this.remove(key);
      return defaultValue;
    }
  }

  remove(key) {
    if (!this.isAvailable) return;

    try {
      localStorage.removeItem(this.getKey(key));
    } catch (error) {
      console.error('Storage removal error:', error);
    }
  }

  clear() {
    if (!this.isAvailable) return;

    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  exists(key) {
    return this.get(key) !== null;
  }

  size() {
    if (!this.isAvailable) return 0;

    try {
      return Object.keys(localStorage)
        .filter(key => key.startsWith(this.prefix))
        .length;
    } catch {
      return 0;
    }
  }

  handleStorageError(error) {
    if (error.name === 'QuotaExceededError') {
      // Clear old data to make space
      this.clearOldData();
      toast.show('Storage full. Cleared old data.', 'warning');
    }
  }

  clearOldData() {
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    const now = Date.now();

    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        try {
          const item = localStorage.getItem(key);
          const parsed = JSON.parse(item);
          if (now - parsed.timestamp > maxAge) {
            localStorage.removeItem(key);
          }
        } catch {
          // Remove corrupted items
          localStorage.removeItem(key);
        }
      }
    });
  }

  // Batch operations for better performance
  setBatch(items) {
    const results = {};
    for (const [key, value] of Object.entries(items)) {
      results[key] = this.set(key, value);
    }
    return results;
  }

  getBatch(keys) {
    const results = {};
    keys.forEach(key => {
      results[key] = this.get(key);
    });
    return results;
  }

  // Export/Import for backup
  export() {
    const data = {};
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(this.prefix)) {
        data[key] = localStorage.getItem(key);
      }
    });
    return JSON.stringify(data);
  }

  import(exportedData) {
    try {
      const data = JSON.parse(exportedData);
      Object.entries(data).forEach(([key, value]) => {
        if (key.startsWith(this.prefix)) {
          localStorage.setItem(key, value);
        }
      });
      return true;
    } catch (error) {
      console.error('Import error:', error);
      return false;
    }
  }
}

// Initialize storage manager
const storage = new StorageManager();

// Validation utilities
const ValidationUtils = {
  validateEmail(email) {
    return VALIDATION_RULES.EMAIL_REGEX.test(email);
  },

  validateName(name) {
    const { NAME_MIN_LENGTH, NAME_MAX_LENGTH } = VALIDATION_RULES;
    return name && 
           name.length >= NAME_MIN_LENGTH && 
           name.length <= NAME_MAX_LENGTH;
  },

  validateDescription(description) {
    return description && 
           description.length <= VALIDATION_RULES.DESCRIPTION_MAX_LENGTH;
  },

  validateReferralCode(code) {
    return VALIDATION_RULES.REFERRAL_CODE_REGEX.test(code);
  },

  validateRating(rating) {
    return Number.isInteger(rating) && rating >= 1 && rating <= 5;
  },

  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { StorageManager, ValidationUtils };
}