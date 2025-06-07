
import * as Sentry from '@sentry/react';
import { LogLevel } from '../../interfaces/types';

export interface SentryInitConfig {
  dsn: string;
  environment: string;
  release?: string;
}

export class SentryConfig {
  static createSentryConfiguration(config: SentryInitConfig): Sentry.BrowserOptions {
    const { dsn, environment, release } = config;
    
    return {
      dsn,
      environment,
      release: release || process.env.VITE_APP_VERSION || 'unknown',
      integrations: [
        Sentry.browserTracingIntegration(),
        Sentry.replayIntegration({
          // Capture 10% of all sessions in production, more in development
          sessionSampleRate: environment === 'production' ? 0.1 : 0.1,
          errorSampleRate: 1.0,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
      
      beforeSend: this.createBeforeSendFilter(environment),
      beforeBreadcrumb: this.createBeforeBreadcrumbFilter(),
    };
  }

  static createBeforeSendFilter(environment: string) {
    return (event: Sentry.Event, hint: Sentry.EventHint) => {
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
    };
  }

  static createBeforeBreadcrumbFilter() {
    return (breadcrumb: Sentry.Breadcrumb) => {
      // Filter out noisy breadcrumbs
      if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
        return null;
      }
      return breadcrumb;
    };
  }

  static mapLogLevelToSentryLevel(level: LogLevel): Sentry.SeverityLevel {
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
}
