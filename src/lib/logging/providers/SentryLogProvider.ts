
import * as Sentry from '@sentry/react';
import { LogProvider } from '../interfaces/LogProvider';
import { LogEntry, LogLevel, LogContext } from '../interfaces/types';

export class SentryLogProvider implements LogProvider {
  private globalContext: LogContext = {};
  private initialized = false;

  constructor(dsn: string, environment: string = 'development', release?: string) {
    this.initSentry(dsn, environment, release);
  }

  private initSentry(dsn: string, environment: string, release?: string): void {
    try {
      Sentry.init({
        dsn,
        environment,
        release: release || process.env.VITE_APP_VERSION || 'unknown',
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            // Capture 10% of all sessions,
            // plus always capture sessions with an error
            sessionSampleRate: 0.1,
            errorSampleRate: 1.0,
          }),
        ],
        // Performance Monitoring
        tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
        // Session Replay
        replaysSessionSampleRate: environment === 'production' ? 0.1 : 0.1,
        replaysOnErrorSampleRate: 1.0,
        
        beforeSend: (event, hint) => {
          // Filter out debug logs in production
          if (environment === 'production' && event.level === 'debug') {
            return null;
          }

          // Filter out sensitive information
          if (event.extra) {
            // Remove any potential sensitive data
            const sensitiveKeys = ['password', 'token', 'secret', 'key', 'authorization'];
            Object.keys(event.extra).forEach(key => {
              if (sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
                delete event.extra![key];
              }
            });
          }

          // Log to console in development for debugging
          if (environment === 'development') {
            console.log('Sentry event:', event, hint);
          }

          return event;
        },

        beforeBreadcrumb: (breadcrumb) => {
          // Filter out noisy breadcrumbs
          if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
            return null;
          }
          return breadcrumb;
        }
      });

      this.initialized = true;
      console.log(`Sentry initialized successfully for ${environment} environment`);
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
      this.initialized = false;
    }
  }

  async log(entry: LogEntry): Promise<void> {
    if (!this.initialized) return;

    const { level, message, context, error, metadata } = entry;
    const fullContext = { ...this.globalContext, ...context };

    // Set Sentry scope for this log entry
    Sentry.withScope((scope) => {
      // Set user context
      if (fullContext.userId) {
        scope.setUser({
          id: fullContext.userId,
          extra: {
            storeId: fullContext.storeId,
            sessionId: fullContext.sessionId
          }
        });
      }

      // Set tags for better filtering
      scope.setTags({
        component: fullContext.component || 'unknown',
        storeId: fullContext.storeId || 'unknown',
        logLevel: level
      });

      // Set extra context
      scope.setContext('logEntry', {
        timestamp: entry.timestamp.toISOString(),
        ...fullContext,
        ...metadata
      });

      // Set fingerprint for better grouping
      if (fullContext.component && fullContext.action) {
        scope.setFingerprint([fullContext.component, fullContext.action, level]);
      }

      if (error) {
        scope.setLevel(this.mapLogLevelToSentryLevel(level));
        Sentry.captureException(error, {
          extra: { 
            message,
            ...metadata 
          }
        });
      } else {
        Sentry.captureMessage(message, this.mapLogLevelToSentryLevel(level));
      }
    });
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
      
      Sentry.setTags({
        storeId: context.storeId || 'unknown',
        component: context.component || 'unknown'
      });
    }
  }

  clearContext(): void {
    this.globalContext = {};
    if (this.initialized) {
      Sentry.setUser(null);
      Sentry.setTags({});
    }
  }
}
