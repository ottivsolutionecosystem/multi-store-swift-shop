
export const CACHE_CONFIG = {
  USER_KEY_PREFIX: 'user:',
  PROFILE_KEY_PREFIX: 'profile:',
  SESSION_KEY_PREFIX: 'session:',
  
  // TTL configurations (in seconds)
  DEFAULT_TTL: 900, // 15 minutes
  PROFILE_TTL: 1800, // 30 minutes
  SESSION_TTL: 3600, // 1 hour
  
  // Memory cache TTL (in milliseconds)
  MEMORY_TTL: 60 * 1000, // 1 minute
} as const;
