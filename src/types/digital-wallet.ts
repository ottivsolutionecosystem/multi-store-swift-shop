
export interface DigitalWalletCard {
  id: string;
  type: 'credit_card' | 'debit_card';
  provider: string; // visa, mastercard, elo, etc
  lastFourDigits: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  isActive: boolean;
  consentGiven: boolean;
  consentDate?: string;
  dataRetentionUntil?: string;
  createdAt: string;
}

export interface DigitalWalletCardFormData {
  type: 'credit_card' | 'debit_card';
  provider: string;
  cardNumber?: string;
  cardholderName: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

export interface LGPDConsent {
  dataCollection: boolean;
  dataProcessing: boolean;
  dataRetention: boolean;
  thirdPartySharing: boolean;
  marketingCommunications: boolean;
}
