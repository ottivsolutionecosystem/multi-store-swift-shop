
import { PaymentProvider, PaymentGatewayType, PaymentMethod, PaymentMethodType } from '@/interfaces/PaymentProvider';

export class StripePaymentProvider implements PaymentProvider {
  readonly type = PaymentGatewayType.STRIPE;
  readonly name = 'Stripe';

  async validateCredentials(credentials: Record<string, string>, testMode: boolean): Promise<boolean> {
    // For Stripe Connect, validation is done through account status
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
    return `${window.location.origin}/supabase/functions/v1/stripe-webhook`;
  }

  async testConnection(credentials: Record<string, string>, testMode: boolean): Promise<{ success: boolean; message: string }> {
    return {
      success: true,
      message: 'Stripe Connect - use o botão "Conectar com Stripe" para estabelecer a conexão'
    };
  }

  /**
   * Check if store is connected to Stripe
   */
  isConnected(stripeUserId?: string): boolean {
    return !!stripeUserId;
  }
}
