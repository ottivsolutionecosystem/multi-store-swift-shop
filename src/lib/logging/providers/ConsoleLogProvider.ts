
import { LogProvider } from '../interfaces/LogProvider';
import { LogEntry, LogLevel, LogContext } from '../interfaces/types';

export class ConsoleLogProvider implements LogProvider {
  private globalContext: LogContext = {};

  async log(entry: LogEntry): Promise<void> {
    const { level, message, context, error, metadata } = entry;
    const fullContext = { ...this.globalContext, ...context };
    
    const logData = {
      timestamp: entry.timestamp.toISOString(),
      level,
      message,
      ...(Object.keys(fullContext).length > 0 && { context: fullContext }),
      ...(metadata && { metadata }),
      ...(error && { error: { name: error.name, message: error.message, stack: error.stack } })
    };

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(`[DEBUG] ${message}`, logData);
        break;
      case LogLevel.INFO:
        console.info(`[INFO] ${message}`, logData);
        break;
      case LogLevel.WARN:
        console.warn(`[WARN] ${message}`, logData);
        break;
      case LogLevel.ERROR:
        console.error(`[ERROR] ${message}`, logData);
        break;
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
  }

  clearContext(): void {
    this.globalContext = {};
  }
}
