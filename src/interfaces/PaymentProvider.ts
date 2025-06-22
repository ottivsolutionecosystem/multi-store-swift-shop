
export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  enabled: boolean;
  icon?: string;
  description?: string;
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PIX = 'pix',
  BANK_TRANSFER = 'bank_transfer',
  DIGITAL_WALLET = 'digital_wallet',
  BOLETO = 'boleto',
  CASH = 'cash'
}

export enum PaymentGatewayType {
  STRIPE = 'stripe',
  MERCADO_PAGO = 'mercado_pago'
}

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  type: PaymentGatewayType;
  enabled: boolean;
  testMode: boolean;
  credentials: Record<string, string>;
  supportedMethods: PaymentMethod[];
  webhookUrl?: string;
}

export interface PaymentProvider {
  readonly type: PaymentGatewayType;
  readonly name: string;
  
  /**
   * Validates the provided credentials
   */
  validateCredentials(credentials: Record<string, string>, testMode: boolean): Promise<boolean>;
  
  /**
   * Gets available payment methods for this provider
   */
  getAvailableMethods(): PaymentMethod[];
  
  /**
   * Generates webhook URL for this provider
   */
  generateWebhookUrl(storeId: string): string;
  
  /**
   * Tests connectivity with the payment provider
   */
  testConnection(credentials: Record<string, string>, testMode: boolean): Promise<{ success: boolean; message: string }>;
}
