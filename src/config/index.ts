
export interface RedisConfig {
  host: string;
  port: number;
  maxRetriesPerRequest: number;
  lazyConnect: boolean;
  connectTimeout: number;
  commandTimeout: number;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

export interface AppConfig {
  redis: RedisConfig;
  supabase: SupabaseConfig;
}

// Configuração centralizada da aplicação
export const config: AppConfig = {
  redis: {
    host: process.env.REDIS_HOST || 'redis-12517.crce196.sa-east-1-2.ec2.redns.redis-cloud.com',
    port: parseInt(process.env.REDIS_PORT || '12517'),
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 10000,
    commandTimeout: 5000,
  },
  supabase: {
    url: process.env.SUPABASE_URL || "https://dkliovgbxuskqmnfojvp.supabase.co",
    anonKey: process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbGlvdmdieHVza3FtbmZvanZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MTcyMDgsImV4cCI6MjA2Mzk5MzIwOH0.w1EKr-ae-jK6_WRKMuvbZ2tbfJ0qaPeyh4uJ2eF2BBw",
  },
};

// Helper para obter configuração do Redis
export const getRedisConfig = (): RedisConfig => config.redis;

// Helper para obter configuração do Supabase
export const getSupabaseConfig = (): SupabaseConfig => config.supabase;
