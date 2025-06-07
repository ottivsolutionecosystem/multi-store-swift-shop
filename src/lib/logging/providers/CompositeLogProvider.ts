
import { LogProvider } from '../interfaces/LogProvider';
import { LogEntry, LogContext } from '../interfaces/types';

export class CompositeLogProvider implements LogProvider {
  private providers: LogProvider[] = [];

  constructor(providers: LogProvider[]) {
    this.providers = providers;
  }

  addProvider(provider: LogProvider): void {
    this.providers.push(provider);
  }

  removeProvider(provider: LogProvider): void {
    const index = this.providers.indexOf(provider);
    if (index > -1) {
      this.providers.splice(index, 1);
    }
  }

  async log(entry: LogEntry): Promise<void> {
    await Promise.all(
      this.providers.map(provider => 
        provider.log(entry).catch(error => 
          console.error('Log provider failed:', error)
        )
      )
    );
  }

  async debug(message: string, context?: LogContext, metadata?: Record<string, any>): Promise<void> {
    await Promise.all(
      this.providers.map(provider => 
        provider.debug(message, context, metadata).catch(error => 
          console.error('Log provider failed:', error)
        )
      )
    );
  }

  async info(message: string, context?: LogContext, metadata?: Record<string, any>): Promise<void> {
    await Promise.all(
      this.providers.map(provider => 
        provider.info(message, context, metadata).catch(error => 
          console.error('Log provider failed:', error)
        )
      )
    );
  }

  async warn(message: string, context?: LogContext, metadata?: Record<string, any>): Promise<void> {
    await Promise.all(
      this.providers.map(provider => 
        provider.warn(message, context, metadata).catch(error => 
          console.error('Log provider failed:', error)
        )
      )
    );
  }

  async error(message: string, error?: Error, context?: LogContext, metadata?: Record<string, any>): Promise<void> {
    await Promise.all(
      this.providers.map(provider => 
        provider.error(message, error, context, metadata).catch(err => 
          console.error('Log provider failed:', err)
        )
      )
    );
  }

  setContext(context: LogContext): void {
    this.providers.forEach(provider => provider.setContext(context));
  }

  clearContext(): void {
    this.providers.forEach(provider => provider.clearContext());
  }
}
