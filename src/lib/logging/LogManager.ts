
import { LogProvider } from './interfaces/LogProvider';
import { LogConfig, LogLevel } from './interfaces/types';
import { ConsoleLogProvider } from './providers/ConsoleLogProvider';
import { SentryLogProvider } from './providers/SentryLogProvider';
import { CompositeLogProvider } from './providers/CompositeLogProvider';
import { getLoggingConfig } from '@/config';

export class LogManager {
  private static instance: LogManager;
  private provider: LogProvider;
  private config: LogConfig;

  private constructor(config: LogConfig) {
    this.config = config;
    this.provider = this.createProvider();
  }

  public static getInstance(config?: LogConfig): LogManager {
    if (!LogManager.instance) {
      if (!config) {
        // Use configuration from config file if no config provided
        const appConfig = getLoggingConfig();
        config = {
          level: appConfig.level as LogLevel,
          enableConsole: appConfig.enableConsole,
          enableSentry: appConfig.enableSentry,
          sentryDsn: appConfig.sentry.dsn,
          environment: appConfig.sentry.environment,
          sampling: appConfig.sentry.tracesSampleRate
        };
      }
      LogManager.instance = new LogManager(config);
    }
    return LogManager.instance;
  }

  private createProvider(): LogProvider {
    const providers: LogProvider[] = [];

    if (this.config.enableConsole) {
      providers.push(new ConsoleLogProvider());
    }

    if (this.config.enableSentry && this.config.sentryDsn) {
      try {
        const sentryConfig = getLoggingConfig().sentry;
        providers.push(new SentryLogProvider(
          sentryConfig.dsn, 
          sentryConfig.environment,
          sentryConfig.release
        ));
      } catch (error) {
        console.error('Failed to initialize Sentry provider:', error);
      }
    }

    if (providers.length === 0) {
      // Fallback to console if no providers are configured
      providers.push(new ConsoleLogProvider());
    }

    return providers.length === 1 ? providers[0] : new CompositeLogProvider(providers);
  }

  public getProvider(): LogProvider {
    return this.provider;
  }

  public updateConfig(newConfig: Partial<LogConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.provider = this.createProvider();
  }

  public getConfig(): LogConfig {
    return { ...this.config };
  }

  public shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const requestedLevelIndex = levels.indexOf(level);
    return requestedLevelIndex >= currentLevelIndex;
  }
}
