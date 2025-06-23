
import { PaymentService } from '@/services/PaymentService';
import { StripeGateway } from '@/gateways/StripeGateway';

/**
 * Middleware to verify if store has payment gateway connected
 */
export class ConnectedAccountMiddleware {
  private paymentService: PaymentService;

  constructor() {
    const stripeGateway = new StripeGateway();
    this.paymentService = new PaymentService(stripeGateway);
  }

  /**
   * Validates if store can process payments
   */
  async validateConnection(storeId: string): Promise<{ valid: boolean; error?: string }> {
    try {
      const validation = await this.paymentService.validatePaymentCapability(storeId);
      
      return {
        valid: validation.canProcess,
        error: validation.reason
      };
    } catch (error) {
      return {
        valid: false,
        error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Middleware function for protecting payment routes
   */
  async requireConnectedAccount(storeId: string): Promise<void> {
    const validation = await this.validateConnection(storeId);
    
    if (!validation.valid) {
      throw new Error(validation.error || 'Store payment gateway not connected');
    }
  }

  /**
   * Checks connection status without throwing errors
   */
  async checkConnection(storeId: string): Promise<{
    connected: boolean;
    canProcess: boolean;
    message: string;
  }> {
    try {
      const validation = await this.validateConnection(storeId);
      const status = await this.paymentService.getStoreConnectionStatus(storeId);
      
      return {
        connected: !!status && status.status === 'connected',
        canProcess: validation.valid,
        message: validation.error || 'Ready to process payments'
      };
    } catch (error) {
      return {
        connected: false,
        canProcess: false,
        message: `Check failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }
}
