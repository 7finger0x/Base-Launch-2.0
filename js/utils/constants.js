// Application Constants
const APP_CONFIG = {
  APP_NAME: 'Base Launch',
  VERSION: '2.0.0',
  API_TIMEOUT: 5000,
  MAX_RETRY_ATTEMPTS: 3,
  WEBSOCKET_RETRY_INTERVAL: 5000,
  JWT_REFRESH_THRESHOLD: 300000, // 5 minutes
  STORAGE_PREFIX: 'base_launch_',
  FARCASTER_APP_URL: 'https://baselaunch.app',
  BASE_CHAIN_ID: 8453
};

const STORAGE_KEYS = {
  APPS: 'apps',
  USER_STACK: 'user_stack',
  LAUNCHES: 'launches',
  COHORTS: 'cohorts',
  USER_PROFILE: 'user_profile',
  AUTH_TOKEN: 'auth_token',
  REFERRAL_CODES: 'referral_codes',
  ANALYTICS_QUEUE: 'analytics_queue',
  LAST_SYNC: 'last_sync',
  OFFLINE_ACTIONS: 'offline_actions'
};

const API_ENDPOINTS = {
  APPS: '/api/apps',
  LAUNCHES: '/api/launches',
  COHORTS: '/api/cohorts',
  AUTH: '/api/auth',
  ANALYTICS: '/api/analytics',
  FARCASTER: '/api/farcaster',
  ADMIN: '/api/admin'
};

const CATEGORIES = [
  'DeFi',
  'Gaming', 
  'Social',
  'AI',
  'Productivity',
  'NFT',
  'Entertainment',
  'Education',
  'Finance',
  'Health'
];

const SORT_OPTIONS = {
  TRENDING: 'trending',
  NEWEST: 'newest',
  RATING: 'rating',
  POPULAR: 'popular'
};

const USER_BADGES = {
  EARLY_ADOPTER: {
    name: 'Early Adopter',
    description: 'One of the first 100 users',
    icon: '🌟',
    threshold: 100
  },
  APP_HUNTER: {
    name: 'App Hunter',
    description: 'Saved 10+ apps',
    icon: '🏹',
    threshold: 10
  },
  LAUNCH_SUPPORTER: {
    name: 'Launch Supporter', 
    description: 'Joined 5+ waitlists',
    icon: '🚀',
    threshold: 5
  },
  VIRAL_HIT: {
    name: 'Viral Hit',
    description: '10+ successful referrals',
    icon: '💥',
    threshold: 10
  }
};

const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Connection lost. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  AUTH_ERROR: 'Authentication failed. Please sign in again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  STORAGE_ERROR: 'Local storage error. Please refresh the page.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.'
};

const VALIDATION_RULES = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 500,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  REFERRAL_CODE_REGEX: /^[A-Z0-9]{6,8}$/
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    APP_CONFIG,
    STORAGE_KEYS,
    API_ENDPOINTS,
    CATEGORIES,
    SORT_OPTIONS,
    USER_BADGES,
    ERROR_MESSAGES,
    VALIDATION_RULES
  };
}