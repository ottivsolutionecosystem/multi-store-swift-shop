import { PaymentGateway, ConnectedAccount, ChargeParams, PaymentResult } from '@/interfaces/PaymentGateway';
import { supabaseClient } from '@/lib/supabaseClient';

export class StripeGateway implements PaymentGateway {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  }

  /**
   * Generates Stripe OAuth authorization URL using the edge function
   */
  async connect(storeId: string): Promise<string> {
    try {
      const { data, error } = await supabaseClient.functions.invoke('stripe-oauth-connect');
      
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      
      return data.auth_url;
    } catch (error) {
      console.error('OAuth connect error:', error);
      throw new Error(`Failed to generate OAuth URL: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handles OAuth callback and exchanges authorization code for access token
   */
  async handleCallback(code: string, state: string): Promise<ConnectedAccount> {
    try {
      const { data, error } = await supabaseClient.functions.invoke('stripe-oauth-callback', {
        body: { code, state }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return {
        id: data.stripe_user_id,
        accountId: data.stripe_user_id,
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        scope: data.scope,
        status: data.fully_onboarded ? 'connected' : 'pending',
        connectedAt: new Date()
      };
    } catch (error) {
      console.error('OAuth callback error:', error);
      throw new Error(`Failed to connect account: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Processes payment using connected Stripe account
   */
  async charge(params: ChargeParams): Promise<PaymentResult> {
    try {
      const { data, error } = await supabaseClient.functions.invoke('stripe-payment-processor', {
        body: {
          amount: params.amount,
          currency: params.currency,
          connectedAccountId: params.connectedAccountId,
          customerId: params.customerId,
          description: params.description,
          metadata: params.metadata
        }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      return {
        id: data.payment_intent_id,
        status: data.status,
        amount: data.amount,
        currency: data.currency,
        clientSecret: data.client_secret
      };
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        id: '',
        status: 'failed',
        amount: params.amount,
        currency: params.currency,
        errorMessage: error instanceof Error ? error.message : 'Payment failed'
      };
    }
  }

  /**
   * Checks if store has a connected Stripe account
   */
  async isConnected(storeId: string): Promise<boolean> {
    try {
      const { data } = await supabaseClient
        .from('store_settings')
        .select('stripe_user_id, stripe_connected')
        .eq('store_id', storeId)
        .single();

      return !!(data?.stripe_user_id && data?.stripe_connected);
    } catch (error) {
      console.error('Connection check error:', error);
      return false;
    }
  }

  /**
   * Disconnects store from Stripe
   */
  async disconnect(storeId: string): Promise<void> {
    try {
      const { error } = await supabaseClient.functions.invoke('stripe-disconnect');
      if (error) throw error;
    } catch (error) {
      console.error('Disconnect error:', error);
      throw new Error(`Failed to disconnect: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Gets detailed connection status
   */
  async getConnectionStatus(storeId: string): Promise<ConnectedAccount | null> {
    try {
      const { data } = await supabaseClient
        .from('store_settings')
        .select('stripe_user_id, stripe_connected, stripe_connect_date')
        .eq('store_id', storeId)
        .single();

      if (!data?.stripe_user_id) return null;

      return {
        id: data.stripe_user_id,
        accountId: data.stripe_user_id,
        status: data.stripe_connected ? 'connected' : 'pending',
        connectedAt: data.stripe_connect_date ? new Date(data.stripe_connect_date) : undefined
      };
    } catch (error) {
      console.error('Status check error:', error);
      return null;
    }
  }
}
