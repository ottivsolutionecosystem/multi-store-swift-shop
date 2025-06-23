
import { PaymentGateway, ChargeParams, PaymentResult } from '@/interfaces/PaymentGateway';

export interface PaymentData {
  amount: number;
  currency: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, string>;
}

/**
 * Payment orchestration service that handles business logic
 * and delegates to payment gateways
 */
export class PaymentService {
  constructor(private gateway: PaymentGateway) {}

  /**
   * Processes payment with middleware checks
   */
  async processPayment(storeId: string, paymentData: PaymentData): Promise<PaymentResult> {
    // Middleware: Check if store is connected
    const isConnected = await this.gateway.isConnected(storeId);
    if (!isConnected) {
      throw new Error('Store is not connected to payment gateway. Please connect your account first.');
    }

    // Get connected account details
    const connectionStatus = await this.gateway.getConnectionStatus(storeId);
    if (!connectionStatus || connectionStatus.status !== 'connected') {
      throw new Error('Payment gateway connection is not active');
    }

    // Prepare charge parameters
    const chargeParams: ChargeParams = {
      amount: paymentData.amount,
      currency: paymentData.currency,
      connectedAccountId: connectionStatus.accountId,
      customerId: paymentData.customerId,
      description: paymentData.description,
      metadata: {
        ...paymentData.metadata,
        store_id: storeId,
        processed_at: new Date().toISOString()
      }
    };

    // Process payment
    return this.gateway.charge(chargeParams);
  }

  /**
   * Initiates connection flow for a store
   */
  async connectStore(storeId: string): Promise<string> {
    return this.gateway.connect(storeId);
  }

  /**
   * Handles OAuth callback
   */
  async handleConnectionCallback(code: string, stateParams: any): Promise<void> {
    const connectedAccount = await this.gateway.handleCallback(code, stateParams);
    
    // Additional business logic can be added here
    // e.g., sending notifications, updating cache, etc.
    console.log('Account connected successfully:', connectedAccount.accountId);
  }

  /**
   * Disconnects store from payment gateway
   */
  async disconnectStore(storeId: string): Promise<void> {
    return this.gateway.disconnect(storeId);
  }

  /**
   * Gets store connection status
   */
  async getStoreConnectionStatus(storeId: string) {
    return this.gateway.getConnectionStatus(storeId);
  }

  /**
   * Middleware check for payment operations
   */
  async validatePaymentCapability(storeId: string): Promise<{ canProcess: boolean; reason?: string }> {
    try {
      const isConnected = await this.gateway.isConnected(storeId);
      if (!isConnected) {
        return { canProcess: false, reason: 'No payment gateway connected' };
      }

      const status = await this.gateway.getConnectionStatus(storeId);
      if (!status || status.status !== 'connected') {
        return { canProcess: false, reason: 'Payment gateway not fully configured' };
      }

      return { canProcess: true };
    } catch (error) {
      return { 
        canProcess: false, 
        reason: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
  }
}
