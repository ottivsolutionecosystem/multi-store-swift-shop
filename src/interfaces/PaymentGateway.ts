
export interface ConnectedAccount {
  id: string;
  accountId: string;
  accessToken?: string;
  refreshToken?: string;
  scope?: string;
  status: 'pending' | 'connected' | 'failed';
  connectedAt?: Date;
}

export interface ChargeParams {
  amount: number;
  currency: string;
  customerId?: string;
  connectedAccountId: string;
  description?: string;
  metadata?: Record<string, string>;
}

export interface PaymentResult {
  id: string;
  status: 'succeeded' | 'failed' | 'pending';
  amount: number;
  currency: string;
  clientSecret?: string;
  errorMessage?: string;
}

export interface PaymentGateway {
  /**
   * Generates OAuth URL for account connection
   */
  connect(storeId: string): Promise<string>;
  
  /**
   * Handles OAuth callback and exchanges code for account details
   */
  handleCallback(code: string, stateParams: any): Promise<ConnectedAccount>;
  
  /**
   * Processes payment using connected account
   */
  charge(params: ChargeParams): Promise<PaymentResult>;
  
  /**
   * Checks if store is connected to payment gateway
   */
  isConnected(storeId: string): Promise<boolean>;
  
  /**
   * Disconnects store from payment gateway
   */
  disconnect(storeId: string): Promise<void>;
  
  /**
   * Gets connection status and details
   */
  getConnectionStatus(storeId: string): Promise<ConnectedAccount | null>;
}
