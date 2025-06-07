
import { CACHE_CONFIG } from './cache-config';

export class CacheKeys {
  static getUserKey(userId: string): string {
    return `${CACHE_CONFIG.USER_KEY_PREFIX}${userId}`;
  }

  static getProfileKey(userId: string): string {
    return `${CACHE_CONFIG.PROFILE_KEY_PREFIX}${userId}`;
  }

  static getSessionKey(sessionId: string): string {
    return `${CACHE_CONFIG.SESSION_KEY_PREFIX}${sessionId}`;
  }
}
