
import { LogManager } from './LogManager';
import { LogContext, LogLevel } from './interfaces/types';

export class Logger {
  private context: LogContext = {};
  private logManager: LogManager;

  constructor(initialContext?: LogContext) {
    this.logManager = LogManager.getInstance();
    if (initialContext) {
      this.context = { ...initialContext };
    }
  }

  public setContext(context: LogContext): Logger {
    this.context = { ...this.context, ...context };
    return this;
  }

  public clearContext(): Logger {
    this.context = {};
    return this;
  }

  public child(context: LogContext): Logger {
    return new Logger({ ...this.context, ...context });
  }

  public async debug(message: string, metadata?: Record<string, any>): Promise<void> {
    if (!this.logManager.shouldLog(LogLevel.DEBUG)) return;
    await this.logManager.getProvider().debug(message, this.context, metadata);
  }

  public async info(message: string, metadata?: Record<string, any>): Promise<void> {
    if (!this.logManager.shouldLog(LogLevel.INFO)) return;
    await this.logManager.getProvider().info(message, this.context, metadata);
  }

  public async warn(message: string, metadata?: Record<string, any>): Promise<void> {
    if (!this.logManager.shouldLog(LogLevel.WARN)) return;
    await this.logManager.getProvider().warn(message, this.context, metadata);
  }

  public async error(message: string, error?: Error, metadata?: Record<string, any>): Promise<void> {
    if (!this.logManager.shouldLog(LogLevel.ERROR)) return;
    await this.logManager.getProvider().error(message, error, this.context, metadata);
  }

  // Convenience methods for common use cases
  public async logUserAction(action: string, metadata?: Record<string, any>): Promise<void> {
    await this.info(`User action: ${action}`, { action, ...metadata });
  }

  public async logApiCall(endpoint: string, method: string, metadata?: Record<string, any>): Promise<void> {
    await this.debug(`API call: ${method} ${endpoint}`, { endpoint, method, ...metadata });
  }

  public async logPerformance(operation: string, duration: number, metadata?: Record<string, any>): Promise<void> {
    await this.info(`Performance: ${operation} took ${duration}ms`, { operation, duration, ...metadata });
  }
}
