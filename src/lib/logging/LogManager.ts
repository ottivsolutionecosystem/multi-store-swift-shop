
import { LogProvider } from './interfaces/LogProvider';
import { LogConfig, LogLevel } from './interfaces/types';
import { ConsoleLogProvider } from './providers/ConsoleLogProvider';
import { SentryLogProvider } from './providers/SentryLogProvider';
import { CompositeLogProvider } from './providers/CompositeLogProvider';

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
        throw new Error('LogManager requires config for initial setup');
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
        providers.push(new SentryLogProvider(this.config.sentryDsn, this.config.environment));
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
