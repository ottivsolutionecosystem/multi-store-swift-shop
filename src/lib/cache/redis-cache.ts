
import { CacheProvider } from './cache-provider';
import Redis from 'ioredis';

let client: Redis | null = null;

function createRedisClient(): Redis {
  if (client) return client;
  
  try {
    client = new Redis({
      host: 'redis-12517.crce196.sa-east-1-2.ec2.redns.redis-cloud.com',
      port: 12517,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 10000,
      commandTimeout: 5000,
    });

    client.on('error', (err) => {
      console.error('Redis connection error:', err);
    });

    client.on('connect', () => {
      console.log('Redis connected successfully');
    });

    return client;
  } catch (error) {
    console.error('Failed to create Redis client:', error);
    throw error;
  }
}

export class RedisCache implements CacheProvider {
  private redis: Redis;

  constructor() {
    this.redis = createRedisClient();
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.redis.get(key);
      if (!value) return null;
      
      const parsed = JSON.parse(value);
      console.log(`Redis cache HIT for key: ${key}`);
      return parsed as T;
    } catch (error) {
      console.error(`Redis get error for key ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 900): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await this.redis.setex(key, ttlSeconds, serialized);
      console.log(`Redis cache SET for key: ${key}, TTL: ${ttlSeconds}s`);
    } catch (error) {
      console.error(`Redis set error for key ${key}:`, error);
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.redis.del(key);
      console.log(`Redis cache DEL for key: ${key}`);
    } catch (error) {
      console.error(`Redis del error for key ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.redis.flushdb();
      console.log('Redis cache cleared');
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }
}
