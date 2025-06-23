
import { StripeGateway } from '@/gateways/StripeGateway';
import { PaymentService } from './PaymentService';

/**
 * Service specifically for managing Stripe OAuth flow
 */
export class StripeOAuthService {
  private paymentService: PaymentService;

  constructor() {
    const stripeGateway = new StripeGateway();
    this.paymentService = new PaymentService(stripeGateway);
  }

  /**
   * Initiates Stripe Connect OAuth flow
   */
  async initiateConnection(storeId: string): Promise<string> {
    try {
      const authUrl = await this.paymentService.connectStore(storeId);
      
      // Log the initiation for audit purposes
      console.log(`OAuth flow initiated for store: ${storeId}`);
      
      return authUrl;
    } catch (error) {
      console.error('Failed to initiate OAuth flow:', error);
      throw new Error(`Unable to start connection process: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handles OAuth callback and completes connection
   */
  async handleCallback(code: string, state: string): Promise<{ success: boolean; storeId: string; message: string }> {
    try {
      // Decode state parameter
      const stateData = JSON.parse(atob(state));
      const { storeId } = stateData;

      if (!storeId) {
        throw new Error('Invalid state parameter - missing store ID');
      }

      // Process the callback
      await this.paymentService.handleConnectionCallback(code, stateData);

      return {
        success: true,
        storeId,
        message: 'Store successfully connected to Stripe'
      };
    } catch (error) {
      console.error('OAuth callback processing failed:', error);
      
      return {
        success: false,
        storeId: '',
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Disconnects store from Stripe
   */
  async disconnect(storeId: string): Promise<void> {
    try {
      await this.paymentService.disconnectStore(storeId);
      console.log(`Store disconnected from Stripe: ${storeId}`);
    } catch (error) {
      console.error('Failed to disconnect store:', error);
      throw new Error(`Disconnect failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets connection status with additional Stripe-specific details
   */
  async getConnectionDetails(storeId: string) {
    try {
      const status = await this.paymentService.getStoreConnectionStatus(storeId);
      const validation = await this.paymentService.validatePaymentCapability(storeId);

      return {
        connected: !!status && status.status === 'connected',
        accountId: status?.accountId,
        connectedAt: status?.connectedAt,
        canProcessPayments: validation.canProcess,
        validationMessage: validation.reason
      };
    } catch (error) {
      console.error('Failed to get connection details:', error);
      return {
        connected: false,
        canProcessPayments: false,
        validationMessage: 'Unable to check connection status'
      };
    }
  }
}
