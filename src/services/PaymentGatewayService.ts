
import { PaymentGatewayConfig, PaymentSettings } from '@/types/payment-gateway';
import { PaymentServiceFactory } from '@/factories/PaymentServiceFactory';
import { PaymentGatewayType } from '@/interfaces/PaymentProvider';

export class PaymentGatewayService {
  async validateGatewayConfig(config: PaymentGatewayConfig): Promise<{ valid: boolean; message: string }> {
    try {
      const provider = PaymentServiceFactory.getProvider(config.type);
      const result = await provider.testConnection(config.credentials, config.testMode);
      
      return {
        valid: result.success,
        message: result.message
      };
    } catch (error) {
      return {
        valid: false,
        message: `Erro ao validar configuração: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  async testGatewayConnection(
    type: PaymentGatewayType, 
    credentials: Record<string, string>, 
    testMode: boolean
  ): Promise<{ success: boolean; message: string }> {
    try {
      const provider = PaymentServiceFactory.getProvider(type);
      return await provider.testConnection(credentials, testMode);
    } catch (error) {
      return {
        success: false,
        message: `Erro ao testar conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      };
    }
  }

  getAvailableGateways(): PaymentGatewayType[] {
    return PaymentServiceFactory.getSupportedGatewayTypes();
  }

  getGatewayInfo(type: PaymentGatewayType) {
    const provider = PaymentServiceFactory.getProvider(type);
    return {
      type: provider.type,
      name: provider.name,
      availableMethods: provider.getAvailableMethods()
    };
  }

  generateWebhookUrl(type: PaymentGatewayType, storeId: string): string {
    const provider = PaymentServiceFactory.getProvider(type);
    return provider.generateWebhookUrl(storeId);
  }

  validatePaymentSettings(settings: PaymentSettings): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check if at least one gateway is enabled only if there are gateways configured
    const enabledGateways = settings.gateways.filter(gateway => gateway.enabled);
    if (settings.gateways.length > 0 && enabledGateways.length === 0) {
      errors.push('Pelo menos um gateway de pagamento deve estar habilitado');
    }

    // Check if default gateway is set and enabled
    if (settings.defaultGateway) {
      const defaultGateway = settings.gateways.find(g => g.id === settings.defaultGateway);
      if (!defaultGateway) {
        errors.push('Gateway padrão não encontrado');
      } else if (!defaultGateway.enabled) {
        errors.push('Gateway padrão deve estar habilitado');
      }
    }

    // Check if at least one payment method is enabled only if there are enabled gateways
    if (enabledGateways.length > 0 && settings.enabledMethods.length === 0) {
      errors.push('Pelo menos um método de pagamento deve estar habilitado');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
