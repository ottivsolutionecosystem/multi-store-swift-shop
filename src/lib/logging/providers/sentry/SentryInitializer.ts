
import * as Sentry from '@sentry/react';
import { SentryConfig, SentryInitConfig } from './SentryConfig';

export class SentryInitializer {
  private initialized = false;

  constructor(config: SentryInitConfig) {
    this.initSentry(config);
  }

  private initSentry(config: SentryInitConfig): void {
    try {
      const sentryOptions = SentryConfig.createSentryConfiguration(config);
      Sentry.init(sentryOptions);

      this.initialized = true;
      console.log(`Sentry initialized successfully for ${config.environment} environment`);
    } catch (error) {
      console.error('Failed to initialize Sentry:', error);
      this.initialized = false;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
