
import { LogManager } from './LogManager';
import { Logger } from './Logger';
import { LogLevel, LogConfig } from './interfaces/types';
import { getLoggingConfig } from '@/config';

// Initialize the LogManager with config from centralized configuration
let logManager: LogManager;

try {
  logManager = LogManager.getInstance();
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

// Export Sentry utilities for advanced usage
export { captureException, captureMessage, setUser, setTag, setContext } from '@sentry/react';
