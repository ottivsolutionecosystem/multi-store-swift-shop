
import { LogProvider } from '../interfaces/LogProvider';
import { LogEntry, LogLevel, LogContext } from '../interfaces/types';
import { SentryInitializer } from './sentry/SentryInitializer';
import { SentryContextManager } from './sentry/SentryContextManager';
import { SentryLogger } from './sentry/SentryLogger';

export class SentryLogProvider implements LogProvider {
  private initializer: SentryInitializer;
  private contextManager: SentryContextManager;
  private logger: SentryLogger;

  constructor(dsn: string, environment: string = 'development', release?: string) {
    this.initializer = new SentryInitializer({ dsn, environment, release });
    this.contextManager = new SentryContextManager();
    this.logger = new SentryLogger(this.contextManager);
  }

  async log(entry: LogEntry): Promise<void> {
    if (!this.initializer.isInitialized()) return;
    await this.logger.logEntry(entry);
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
    if (this.initializer.isInitialized()) {
      this.contextManager.setContext(context);
    }
  }

  clearContext(): void {
    if (this.initializer.isInitialized()) {
      this.contextManager.clearContext();
    }
  }
}
