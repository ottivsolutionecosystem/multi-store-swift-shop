
import { PaymentProvider, PaymentGatewayType } from '@/interfaces/PaymentProvider';
import { StripePaymentProvider } from '@/providers/StripePaymentProvider';
import { MercadoPagoPaymentProvider } from '@/providers/MercadoPagoPaymentProvider';

export class PaymentServiceFactory {
  private static providers = new Map<PaymentGatewayType, PaymentProvider>();

  static {
    // Initialize providers
    this.providers.set(PaymentGatewayType.STRIPE, new StripePaymentProvider());
    this.providers.set(PaymentGatewayType.MERCADO_PAGO, new MercadoPagoPaymentProvider());
  }

  static getProvider(type: PaymentGatewayType): PaymentProvider {
    const provider = this.providers.get(type);
    if (!provider) {
      throw new Error(`Payment provider not found for type: ${type}`);
    }
    return provider;
  }

  static getAllProviders(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }

  static getSupportedGatewayTypes(): PaymentGatewayType[] {
    return Array.from(this.providers.keys());
  }
}
