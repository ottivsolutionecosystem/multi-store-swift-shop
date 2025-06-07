
import { LogEntry, LogLevel, LogContext } from './types';

export interface LogProvider {
  log(entry: LogEntry): Promise<void>;
  debug(message: string, context?: LogContext, metadata?: Record<string, any>): Promise<void>;
  info(message: string, context?: LogContext, metadata?: Record<string, any>): Promise<void>;
  warn(message: string, context?: LogContext, metadata?: Record<string, any>): Promise<void>;
  error(message: string, error?: Error, context?: LogContext, metadata?: Record<string, any>): Promise<void>;
  setContext(context: LogContext): void;
  clearContext(): void;
}
