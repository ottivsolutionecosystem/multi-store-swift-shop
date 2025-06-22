
import { PaymentProvider, PaymentGatewayType, PaymentMethod, PaymentMethodType } from '@/interfaces/PaymentProvider';

export class StripePaymentProvider implements PaymentProvider {
  readonly type = PaymentGatewayType.STRIPE;
  readonly name = 'Stripe';

  async validateCredentials(credentials: Record<string, string>, testMode: boolean): Promise<boolean> {
    // For Stripe Connect, we don't validate credentials directly
    // Instead, we check if the store is connected via OAuth
    return true;
  }

  getAvailableMethods(): PaymentMethod[] {
    return [
      {
        id: 'stripe_card',
        name: 'Cartão de Crédito/Débito',
        type: PaymentMethodType.CREDIT_CARD,
        enabled: true,
        icon: 'credit-card',
        description: 'Visa, Mastercard, American Express'
      },
      {
        id: 'stripe_pix',
        name: 'PIX',
        type: PaymentMethodType.PIX,
        enabled: true,
        icon: 'smartphone',
        description: 'Pagamento instantâneo via PIX'
      },
      {
        id: 'stripe_apple_pay',
        name: 'Apple Pay',
        type: PaymentMethodType.DIGITAL_WALLET,
        enabled: false,
        icon: 'smartphone',
        description: 'Pagamento via Apple Pay'
      },
      {
        id: 'stripe_google_pay',
        name: 'Google Pay',
        type: PaymentMethodType.DIGITAL_WALLET,
        enabled: false,
        icon: 'smartphone',
        description: 'Pagamento via Google Pay'
      },
      {
        id: 'stripe_bank_transfer',
        name: 'Transferência Bancária',
        type: PaymentMethodType.BANK_TRANSFER,
        enabled: false,
        icon: 'building',
        description: 'Transferência bancária direta'
      }
    ];
  }

  generateWebhookUrl(storeId: string): string {
    return `${window.location.origin}/api/webhooks/stripe/${storeId}`;
  }

  async testConnection(credentials: Record<string, string>, testMode: boolean): Promise<{ success: boolean; message: string }> {
    // For Stripe Connect, we check if the account is connected
    // This will be handled by the UI to check stripe_connected field
    return {
      success: true,
      message: 'Stripe Connect - use o botão "Conectar com Stripe" para estabelecer a conexão'
    };
  }

  /**
   * Generate Stripe Connect OAuth URL
   */
  generateConnectUrl(storeId: string): string {
    const clientId = 'ca_QxEKYQi3XAWpR8Yb6xG2H2kqjGaQXx8Z'; // This should be from environment
    const redirectUri = `${window.location.origin}/supabase/functions/v1/stripe-connect-oauth`;
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      scope: 'read_write',
      redirect_uri: redirectUri,
      state: storeId, // Pass store_id as state parameter
    });

    return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
  }

  /**
   * Check if store is connected to Stripe
   */
  isConnected(stripeUserId?: string): boolean {
    return !!stripeUserId;
  }
}
