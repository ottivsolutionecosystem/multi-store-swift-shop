
import { Database } from '@/integrations/supabase/types';
import { PaymentMethod, PaymentMethodFormData } from '@/types/payment-method';
import { UserSessionService } from './UserSessionService';
import { supabaseClient } from '@/lib/supabaseClient';

type Profile = Database['public']['Tables']['profiles']['Row'];

export class PaymentMethodService {
  private userSessionService: UserSessionService;

  constructor() {
    this.userSessionService = new UserSessionService();
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    console.log('PaymentMethodService - getting payment methods');
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        console.log('PaymentMethodService - no authenticated user');
        return [];
      }

      const { data: profile, error } = await supabaseClient
        .from('profiles')
        .select('payment_methods')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('PaymentMethodService - error getting payment methods:', error);
        throw error;
      }

      // Safe type conversion from Json to PaymentMethod[]
      const paymentMethodsData = profile?.payment_methods as unknown;
      const paymentMethods: PaymentMethod[] = Array.isArray(paymentMethodsData) ? paymentMethodsData as PaymentMethod[] : [];
      console.log('PaymentMethodService - payment methods loaded:', paymentMethods.length);
      
      return paymentMethods.filter(method => method.isActive);
    } catch (error) {
      console.error('PaymentMethodService - error in getPaymentMethods:', error);
      throw error;
    }
  }

  async addPaymentMethod(data: PaymentMethodFormData): Promise<PaymentMethod> {
    console.log('PaymentMethodService - adding payment method');
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const currentMethods = await this.getPaymentMethods();
      
      // Create new payment method
      const newMethod: PaymentMethod = {
        id: crypto.randomUUID(),
        type: data.type,
        provider: data.provider,
        lastFourDigits: data.cardNumber ? data.cardNumber.slice(-4) : undefined,
        cardholderName: data.cardholderName,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        pixKey: data.pixKey,
        pixKeyType: data.pixKeyType,
        isDefault: data.isDefault,
        isActive: true,
        consentGiven: true,
        consentDate: new Date().toISOString(),
        dataRetentionUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        createdAt: new Date().toISOString()
      };

      // If this is set as default, remove default from others
      const updatedMethods = currentMethods.map(method => ({
        ...method,
        isDefault: data.isDefault ? false : method.isDefault
      }));

      updatedMethods.push(newMethod);

      // Convert to unknown first, then to Json for Supabase
      const methodsAsJson = updatedMethods as unknown as Database['public']['Tables']['profiles']['Update']['payment_methods'];

      const { error } = await supabaseClient
        .from('profiles')
        .update({ payment_methods: methodsAsJson })
        .eq('id', user.id);

      if (error) {
        console.error('PaymentMethodService - error adding payment method:', error);
        throw error;
      }

      console.log('PaymentMethodService - payment method added successfully');
      return newMethod;
    } catch (error) {
      console.error('PaymentMethodService - error in addPaymentMethod:', error);
      throw error;
    }
  }

  async updatePaymentMethod(methodId: string, data: Partial<PaymentMethodFormData>): Promise<PaymentMethod> {
    console.log('PaymentMethodService - updating payment method:', methodId);
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const currentMethods = await this.getPaymentMethods();
      const methodIndex = currentMethods.findIndex(method => method.id === methodId);
      
      if (methodIndex === -1) {
        throw new Error('Payment method not found');
      }

      // If setting as default, remove default from others
      if (data.isDefault) {
        currentMethods.forEach(method => {
          if (method.id !== methodId) {
            method.isDefault = false;
          }
        });
      }

      // Update the specific method
      const updatedMethod = {
        ...currentMethods[methodIndex],
        ...data,
        lastFourDigits: data.cardNumber ? data.cardNumber.slice(-4) : currentMethods[methodIndex].lastFourDigits
      };

      currentMethods[methodIndex] = updatedMethod;

      // Convert to unknown first, then to Json for Supabase
      const methodsAsJson = currentMethods as unknown as Database['public']['Tables']['profiles']['Update']['payment_methods'];

      const { error } = await supabaseClient
        .from('profiles')
        .update({ payment_methods: methodsAsJson })
        .eq('id', user.id);

      if (error) {
        console.error('PaymentMethodService - error updating payment method:', error);
        throw error;
      }

      console.log('PaymentMethodService - payment method updated successfully');
      return updatedMethod;
    } catch (error) {
      console.error('PaymentMethodService - error in updatePaymentMethod:', error);
      throw error;
    }
  }

  async removePaymentMethod(methodId: string): Promise<void> {
    console.log('PaymentMethodService - removing payment method:', methodId);
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const currentMethods = await this.getPaymentMethods();
      const updatedMethods = currentMethods.filter(method => method.id !== methodId);

      // Convert to unknown first, then to Json for Supabase
      const methodsAsJson = updatedMethods as unknown as Database['public']['Tables']['profiles']['Update']['payment_methods'];

      const { error } = await supabaseClient
        .from('profiles')
        .update({ payment_methods: methodsAsJson })
        .eq('id', user.id);

      if (error) {
        console.error('PaymentMethodService - error removing payment method:', error);
        throw error;
      }

      console.log('PaymentMethodService - payment method removed successfully');
    } catch (error) {
      console.error('PaymentMethodService - error in removePaymentMethod:', error);
      throw error;
    }
  }

  async setDefaultPaymentMethod(methodId: string): Promise<void> {
    console.log('PaymentMethodService - setting default payment method:', methodId);
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const currentMethods = await this.getPaymentMethods();
      const updatedMethods = currentMethods.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }));

      // Convert to unknown first, then to Json for Supabase
      const methodsAsJson = updatedMethods as unknown as Database['public']['Tables']['profiles']['Update']['payment_methods'];

      const { error } = await supabaseClient
        .from('profiles')
        .update({ payment_methods: methodsAsJson })
        .eq('id', user.id);

      if (error) {
        console.error('PaymentMethodService - error setting default payment method:', error);
        throw error;
      }

      console.log('PaymentMethodService - default payment method set successfully');
    } catch (error) {
      console.error('PaymentMethodService - error in setDefaultPaymentMethod:', error);
      throw error;
    }
  }
}
