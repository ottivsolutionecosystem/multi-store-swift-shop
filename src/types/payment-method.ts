
export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'pix';
  provider?: string; // visa, mastercard, elo, pix
  lastFourDigits?: string;
  cardholderName?: string;
  expiryMonth?: number;
  expiryYear?: number;
  pixKey?: string;
  pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  isDefault: boolean;
  isActive: boolean;
  consentGiven: boolean;
  consentDate?: string;
  dataRetentionUntil?: string;
  createdAt: string;
}

export interface PaymentMethodFormData {
  type: 'credit_card' | 'debit_card' | 'pix';
  provider?: string;
  cardNumber?: string;
  cardholderName?: string;
  expiryMonth?: number;
  expiryYear?: number;
  pixKey?: string;
  pixKeyType?: 'cpf' | 'cnpj' | 'email' | 'phone' | 'random';
  isDefault: boolean;
}

export interface LGPDConsent {
  dataCollection: boolean;
  dataProcessing: boolean;
  dataRetention: boolean;
  thirdPartySharing: boolean;
  marketingCommunications: boolean;
}
