
import { LogManager } from './LogManager';
import { Logger } from './Logger';
import { LogLevel, LogConfig } from './interfaces/types';

// Default configuration
const getDefaultLogConfig = (): LogConfig => ({
  level: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableSentry: process.env.NODE_ENV === 'production',
  sentryDsn: process.env.SENTRY_DSN || 'https://4a66f38f73e916262444309d0f5ea784@o4509455574171648.ingest.us.sentry.io/4509455575351296',
  environment: process.env.NODE_ENV || 'development',
  sampling: 0.1
});

// Initialize the LogManager with default config
let logManager: LogManager;

try {
  logManager = LogManager.getInstance(getDefaultLogConfig());
} catch (error) {
  console.error('Failed to initialize LogManager:', error);
  // Create a minimal fallback
  logManager = LogManager.getInstance({
    level: LogLevel.INFO,
    enableConsole: true,
    enableSentry: false,
    environment: 'development'
  });
}

// Export a default logger instance
export const logger = new Logger();

// Export factory functions
export const createLogger = (context?: any) => new Logger(context);

// Export utilities for migration from console
export const log = {
  debug: (message: string, ...args: any[]) => logger.debug(message, { args }),
  info: (message: string, ...args: any[]) => logger.info(message, { args }),
  warn: (message: string, ...args: any[]) => logger.warn(message, { args }),
  error: (message: string, error?: Error, ...args: any[]) => logger.error(message, error, { args }),
  log: (message: string, ...args: any[]) => logger.info(message, { args }) // console.log maps to info
};

// Export all types and classes for advanced usage
export { LogManager } from './LogManager';
export { Logger } from './Logger';
export { LogLevel, type LogConfig, type LogContext, type LogEntry } from './interfaces/types';
export { type LogProvider } from './interfaces/LogProvider';
export { ConsoleLogProvider } from './providers/ConsoleLogProvider';
export { SentryLogProvider } from './providers/SentryLogProvider';
export { CompositeLogProvider } from './providers/CompositeLogProvider';
