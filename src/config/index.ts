
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

export interface SentryConfig {
  dsn: string;
  environment: string;
  release?: string;
  tracesSampleRate: number;
}

export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  enableConsole: boolean;
  enableSentry: boolean;
  sentryDsn: string;
  environment: string;
  sampling: number;
  sentry: SentryConfig;
}

export interface AppConfig {
  redis: RedisConfig;
  supabase: SupabaseConfig;
  logging: LoggingConfig;
}

// Get environment from import.meta.env for browser compatibility
const getEnvironment = () => {
  if (typeof window !== 'undefined') {
    return import.meta.env.MODE || 'development';
  }
  return 'development';
};

// Configuração centralizada da aplicação
export const config: AppConfig = {
  redis: {
    host: import.meta.env.VITE_REDIS_HOST || 'redis-12517.crce196.sa-east-1-2.ec2.redns.redis-cloud.com',
    port: parseInt(import.meta.env.VITE_REDIS_PORT || '12517'),
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    connectTimeout: 10000,
    commandTimeout: 5000,
  },
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || "https://dkliovgbxuskqmnfojvp.supabase.co",
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrbGlvdmdieHVza3FtbmZvanZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0MTcyMDgsImV4cCI6MjA2Mzk5MzIwOH0.w1EKr-ae-jK6_WRKMuvbZ2tbfJ0qaPeyh4uJ2eF2BBw",
  },
  logging: {
    level: (import.meta.env.VITE_LOG_LEVEL as any) || (getEnvironment() === 'production' ? 'info' : 'debug'),
    enableConsole: import.meta.env.VITE_ENABLE_CONSOLE_LOGS !== 'true',
    enableSentry: import.meta.env.VITE_ENABLE_SENTRY === 'true' || getEnvironment() === 'production',
    sentryDsn: import.meta.env.VITE_SENTRY_DSN || 'https://0bf18f373ec2cace6602ac4f7a794e2a@o4509455574171648.ingest.us.sentry.io/4509455789522944',
    environment: getEnvironment(),
    sampling: parseFloat(import.meta.env.VITE_SENTRY_SAMPLING || '0.1'),
    sentry: {
      dsn: import.meta.env.VITE_SENTRY_DSN || 'https://0bf18f373ec2cace6602ac4f7a794e2a@o4509455574171648.ingest.us.sentry.io/4509455789522944',
      environment: getEnvironment(),
      release: import.meta.env.VITE_APP_VERSION || 'unknown',
      tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_SAMPLING || '0.1'),
    },
  },
};

// Helper para obter configuração do Redis
export const getRedisConfig = (): RedisConfig => config.redis;

// Helper para obter configuração do Supabase
export const getSupabaseConfig = (): SupabaseConfig => config.supabase;

// Helper para obter configuração de Logging
export const getLoggingConfig = (): LoggingConfig => config.logging;
