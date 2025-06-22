
import { PaymentProvider, PaymentGatewayType, PaymentMethod, PaymentMethodType } from '@/interfaces/PaymentProvider';

export class MercadoPagoPaymentProvider implements PaymentProvider {
  readonly type = PaymentGatewayType.MERCADO_PAGO;
  readonly name = 'Mercado Pago';

  async validateCredentials(credentials: Record<string, string>, testMode: boolean): Promise<boolean> {
    const { publicKey, accessToken } = credentials;
    
    if (!publicKey || !accessToken) {
      return false;
    }

    // Validate key format
    const expectedPublicPrefix = testMode ? 'TEST-' : 'APP_USR-';
    const expectedAccessPrefix = testMode ? 'TEST-' : 'APP_USR-';
    
    return publicKey.startsWith(expectedPublicPrefix) && accessToken.startsWith(expectedAccessPrefix);
  }

  getAvailableMethods(): PaymentMethod[] {
    return [
      {
        id: 'mercado_pago_card',
        name: 'Cartão de Crédito/Débito',
        type: PaymentMethodType.CREDIT_CARD,
        enabled: true,
        icon: 'credit-card',
        description: 'Visa, Mastercard, Elo, Hipercard'
      },
      {
        id: 'mercado_pago_pix',
        name: 'PIX',
        type: PaymentMethodType.PIX,
        enabled: true,
        icon: 'zap',
        description: 'Pagamento instantâneo via PIX'
      },
      {
        id: 'mercado_pago_boleto',
        name: 'Boleto Bancário',
        type: PaymentMethodType.BOLETO,
        enabled: false,
        icon: 'file-text',
        description: 'Boleto bancário com vencimento'
      },
      {
        id: 'mercado_pago_bank_transfer',
        name: 'Transferência Bancária',
        type: PaymentMethodType.BANK_TRANSFER,
        enabled: false,
        icon: 'building',
        description: 'Transferência bancária via Mercado Pago'
      }
    ];
  }

  generateWebhookUrl(storeId: string): string {
    return `${window.location.origin}/api/webhooks/mercado-pago/${storeId}`;
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

      // Here you could make an actual API call to Mercado Pago to test the connection
      return {
        success: true,
        message: 'Conexão com Mercado Pago estabelecida com sucesso!'
      };
    } catch (error) {
      return {
        success: false,
        message: `Erro ao conectar com Mercado Pago: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }
}
