
export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface LogContext {
  userId?: string;
  storeId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  [key: string]: any;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: Date;
  error?: Error;
  metadata?: Record<string, any>;
}

export interface LogConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableSentry: boolean;
  sentryDsn?: string;
  environment: string;
  sampling?: number;
}
