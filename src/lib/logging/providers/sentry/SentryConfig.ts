
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
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: environment === 'production' ? 0.1 : 1.0,
      
      // Replay settings - moved here from integration config
      replaysSessionSampleRate: environment === 'production' ? 0.1 : 0.1,
      replaysOnErrorSampleRate: 1.0,
      
      // Remove beforeSend for now to fix type issues
      beforeBreadcrumb: this.createBeforeBreadcrumbFilter(),
    };
  }

  static createBeforeBreadcrumbFilter() {
    return (breadcrumb: Sentry.Breadcrumb): Sentry.Breadcrumb | null => {
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
