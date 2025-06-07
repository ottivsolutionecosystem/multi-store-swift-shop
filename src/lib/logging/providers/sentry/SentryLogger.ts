
import * as Sentry from '@sentry/react';
import { LogEntry, LogLevel } from '../../interfaces/types';
import { SentryConfig } from './SentryConfig';
import { SentryContextManager } from './SentryContextManager';

export class SentryLogger {
  constructor(private contextManager: SentryContextManager) {}

  async logEntry(entry: LogEntry): Promise<void> {
    const { level, message, context, error, metadata } = entry;
    const fullContext = this.contextManager.configureScopeForLog(context, metadata);
    const sentryLevel = SentryConfig.mapLogLevelToSentryLevel(level);

    this.contextManager.withScope(fullContext, level, metadata, (scope) => {
      scope.setLevel(sentryLevel);
      
      if (error) {
        Sentry.captureException(error, {
          extra: { 
            message,
            ...metadata 
          }
        });
      } else {
        Sentry.captureMessage(message, sentryLevel);
      }
    });
  }
}
