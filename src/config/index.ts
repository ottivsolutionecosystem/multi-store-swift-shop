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

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  enableConsole: boolean;
  enableSentry: boolean;
  sentryDsn: string;
  environment: string;
  sampling: number;
}

export interface AppConfig {
  redis: RedisConfig;
  supabase: SupabaseConfig;
  logging: LoggingConfig;
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
  logging: {
    level: (process.env.LOG_LEVEL as any) || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    enableConsole: process.env.ENABLE_CONSOLE_LOGS !== 'false',
    enableSentry: process.env.ENABLE_SENTRY === 'true' || process.env.NODE_ENV === 'production',
    sentryDsn: process.env.SENTRY_DSN || 'https://4a66f38f73e916262444309d0f5ea784@o4509455574171648.ingest.us.sentry.io/4509455575351296',
    environment: process.env.NODE_ENV || 'development',
    sampling: parseFloat(process.env.SENTRY_SAMPLING || '0.1'),
  },
};

// Helper para obter configuração do Redis
export const getRedisConfig = (): RedisConfig => config.redis;

// Helper para obter configuração do Supabase
export const getSupabaseConfig = (): SupabaseConfig => config.supabase;

// Helper para obter configuração de Logging
export const getLoggingConfig = (): LoggingConfig => config.logging;
