
/**
 * Example usage of the new Stripe Connect OAuth payment system
 * This file demonstrates how to use the payment services in different scenarios
 */

import { PaymentService } from '@/services/PaymentService';
import { StripeGateway } from '@/gateways/StripeGateway';
import { ConnectedAccountMiddleware } from '@/middleware/ConnectedAccountMiddleware';

// Example 1: Processing a payment with full validation
export async function processStorePayment(storeId: string, orderData: {
  amount: number;
  customerId?: string;
  description: string;
}) {
  try {
    // Initialize payment service with Stripe gateway
    const stripeGateway = new StripeGateway();
    const paymentService = new PaymentService(stripeGateway);

    // Process payment (includes automatic validation)
    const result = await paymentService.processPayment(storeId, {
      amount: orderData.amount,
      currency: 'brl',
      customerId: orderData.customerId,
      description: orderData.description,
      metadata: {
        order_id: 'order_123',
        store_id: storeId
      }
    });

    if (result.status === 'succeeded') {
      console.log('Payment successful:', result.id);
      return { success: true, paymentId: result.id };
    } else {
      console.error('Payment failed:', result.errorMessage);
      return { success: false, error: result.errorMessage };
    }

  } catch (error) {
    console.error('Payment processing error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Example 2: Using middleware to protect payment routes
export async function protectedPaymentHandler(storeId: string, paymentData: any) {
  try {
    // Use middleware to verify connection
    const middleware = new ConnectedAccountMiddleware();
    
    // This will throw an error if store is not connected
    await middleware.requireConnectedAccount(storeId);

    // Proceed with payment processing
    const stripeGateway = new StripeGateway();
    const paymentService = new PaymentService(stripeGateway);
    
    return await paymentService.processPayment(storeId, paymentData);

  } catch (error) {
    console.error('Protected route error:', error);
    throw new Error(`Payment not allowed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Example 3: Checking connection status before showing payment options
export async function getPaymentCapabilities(storeId: string) {
  try {
    const middleware = new ConnectedAccountMiddleware();
    const connectionStatus = await middleware.checkConnection(storeId);

    return {
      canProcessPayments: connectionStatus.canProcess,
      isConnected: connectionStatus.connected,
      statusMessage: connectionStatus.message,
      // Use this to conditionally show payment UI
      showPaymentForm: connectionStatus.canProcess,
      showConnectButton: !connectionStatus.connected
    };

  } catch (error) {
    return {
      canProcessPayments: false,
      isConnected: false,
      statusMessage: 'Error checking payment capabilities',
      showPaymentForm: false,
      showConnectButton: true
    };
  }
}

// Example 4: Complete checkout flow with Stripe Connect
export async function completeCheckout(storeId: string, checkoutData: {
  items: Array<{ productId: string; quantity: number; price: number }>;
  customerInfo: { email: string; name: string };
  shippingAddress: any;
}) {
  try {
    // 1. Validate store can process payments
    const capabilities = await getPaymentCapabilities(storeId);
    if (!capabilities.canProcessPayments) {
      throw new Error('Store cannot process payments. Please connect payment gateway.');
    }

    // 2. Calculate total
    const totalAmount = checkoutData.items.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );

    // 3. Process payment
    const paymentResult = await processStorePayment(storeId, {
      amount: totalAmount,
      description: `Order from store ${storeId}`,
    });

    if (!paymentResult.success) {
      throw new Error(paymentResult.error || 'Payment failed');
    }

    // 4. Return success with payment details
    return {
      success: true,
      paymentId: paymentResult.paymentId,
      totalAmount,
      message: 'Checkout completed successfully'
    };

  } catch (error) {
    console.error('Checkout error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Checkout failed'
    };
  }
}

// Example 5: Store connection management
export async function manageStoreConnection(storeId: string, action: 'connect' | 'disconnect' | 'status') {
  const stripeGateway = new StripeGateway();
  const paymentService = new PaymentService(stripeGateway);

  switch (action) {
    case 'connect':
      // Returns OAuth URL for redirection
      return await paymentService.connectStore(storeId);

    case 'disconnect':
      await paymentService.disconnectStore(storeId);
      return { success: true, message: 'Store disconnected successfully' };

    case 'status':
      const status = await paymentService.getStoreConnectionStatus(storeId);
      return {
        connected: !!status && status.status === 'connected',
        accountId: status?.accountId,
        connectedAt: status?.connectedAt,
        details: status
      };

    default:
      throw new Error('Invalid action');
  }
}
