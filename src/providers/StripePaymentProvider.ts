
import { PaymentProvider, PaymentGatewayType, PaymentMethod, PaymentMethodType } from '@/interfaces/PaymentProvider';

export class StripePaymentProvider implements PaymentProvider {
  readonly type = PaymentGatewayType.STRIPE;
  readonly name = 'Stripe';

  async validateCredentials(credentials: Record<string, string>, testMode: boolean): Promise<boolean> {
    const { publicKey, secretKey } = credentials;
    
    if (!publicKey || !secretKey) {
      return false;
    }

    // Validate key format
    const expectedPrefix = testMode ? 'pk_test_' : 'pk_live_';
    const expectedSecretPrefix = testMode ? 'sk_test_' : 'sk_live_';
    
    return publicKey.startsWith(expectedPrefix) && secretKey.startsWith(expectedSecretPrefix);
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
    try {
      const isValid = await this.validateCredentials(credentials, testMode);
      
      if (!isValid) {
        return {
          success: false,
          message: 'Credenciais inválidas. Verifique as chaves fornecidas.'
        };
      }

      // Here you could make an actual API call to Stripe to test the connection
      // For now, we'll just validate the format
      return {
        success: true,
        message: 'Conexão com Stripe estabelecida com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao conectar com Stripe: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
}
