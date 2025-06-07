
import * as Sentry from '@sentry/browser';
import { LogProvider } from '../interfaces/LogProvider';
import { LogEntry, LogLevel, LogContext } from '../interfaces/types';

export class SentryLogProvider implements LogProvider {
  private globalContext: LogContext = {};
  private initialized = false;

  constructor(dsn: string, environment: string = 'development') {
    this.initSentry(dsn, environment);
  }

  private initSentry(dsn: string, environment: string): void {
    try {
      Sentry.init({
        dsn,
        environment,
        integrations: [
          Sentry.browserTracingIntegration(),
        ],
        tracesSampleRate: 0.1,
        beforeSend: (event) => {
          // Filter out debug logs in production
          if (environment === 'production' && event.level === 'debug') {
            return null;
          }
          return event;
        }
      });
      this.initialized = true;
      console.log('Sentry initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
      this.initialized = false;
    }
  }

  async log(entry: LogEntry): Promise<void> {
    if (!this.initialized) return;

    const { level, message, context, error, metadata } = entry;
    const fullContext = { ...this.globalContext, ...context };

    // Set Sentry context
    Sentry.setContext('custom', {
      ...fullContext,
      ...metadata,
      timestamp: entry.timestamp.toISOString()
    });

    if (error) {
      Sentry.captureException(error, {
        level: this.mapLogLevelToSentryLevel(level),
        extra: { message, ...metadata },
        tags: { component: fullContext.component }
      });
    } else {
      Sentry.captureMessage(message, this.mapLogLevelToSentryLevel(level));
    }
  }

  private mapLogLevelToSentryLevel(level: LogLevel): Sentry.SeverityLevel {
    switch (level) {
      case LogLevel.DEBUG:
        return 'debug';
      case LogLevel.INFO:
        return 'info';
      case LogLevel.WARN:
        return 'warning';
      case LogLevel.ERROR:
        return 'error';
      default:
        return 'info';
    }
  }

  async debug(message: string, context?: LogContext, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.DEBUG,
      message,
      context,
      metadata,
      timestamp: new Date()
    });
  }

  async info(message: string, context?: LogContext, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.INFO,
      message,
      context,
      metadata,
      timestamp: new Date()
    });
  }

  async warn(message: string, context?: LogContext, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.WARN,
      message,
      context,
      metadata,
      timestamp: new Date()
    });
  }

  async error(message: string, error?: Error, context?: LogContext, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      level: LogLevel.ERROR,
      message,
      context,
      metadata,
      error,
      timestamp: new Date()
    });
  }

  setContext(context: LogContext): void {
    this.globalContext = { ...this.globalContext, ...context };
    
    if (this.initialized) {
      Sentry.setUser({
        id: context.userId,
        extra: {
          storeId: context.storeId,
          sessionId: context.sessionId
        }
      });
    }
  }

  clearContext(): void {
    this.globalContext = {};
    if (this.initialized) {
      Sentry.setUser(null);
    }
  }
}
