
import * as Sentry from '@sentry/react';
import { LogContext } from '../../interfaces/types';

export class SentryContextManager {
  private globalContext: LogContext = {};

  setContext(context: LogContext): void {
    this.globalContext = { ...this.globalContext, ...context };
    
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

  clearContext(): void {
    this.globalContext = {};
    Sentry.setUser(null);
    Sentry.setTags({});
  }

  getGlobalContext(): LogContext {
    return { ...this.globalContext };
  }

  configureScopeForLog(context?: LogContext, metadata?: Record<string, any>): LogContext {
    return { ...this.globalContext, ...context };
  }

  withScope<T>(
    fullContext: LogContext,
    level: string,
    metadata?: Record<string, any>,
    callback: (scope: Sentry.Scope) => T
  ): T {
    return Sentry.withScope((scope) => {
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
        timestamp: new Date().toISOString(),
        ...fullContext,
        ...metadata
      });

      // Set fingerprint for better grouping
      if (fullContext.component && fullContext.action) {
        scope.setFingerprint([fullContext.component, fullContext.action, level]);
      }

      return callback(scope);
    });
  }
}
