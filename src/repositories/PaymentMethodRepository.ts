
import { Database } from '@/integrations/supabase/types';
import { PaymentMethod } from '@/types/payment-method';
import { supabaseClient } from '@/lib/supabaseClient';

export class PaymentMethodRepository {
  async getPaymentMethodsByUserId(userId: string): Promise<PaymentMethod[]> {
    console.log('PaymentMethodRepository - getting payment methods for user:', userId);

    const { data: profile, error } = await supabaseClient
      .from('profiles')
      .select('payment_methods')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('PaymentMethodRepository - error getting payment methods:', error);
      throw error;
    }

    // Safe type conversion from Json to PaymentMethod[]
    const paymentMethodsData = profile?.payment_methods as unknown;
    const paymentMethods: PaymentMethod[] = Array.isArray(paymentMethodsData) ? paymentMethodsData as PaymentMethod[] : [];
    
    return paymentMethods.filter(method => method.isActive);
  }

  async updatePaymentMethods(userId: string, methods: PaymentMethod[]): Promise<void> {
    console.log('PaymentMethodRepository - updating payment methods for user:', userId);

    // Convert to unknown first, then to Json for Supabase
    const methodsAsJson = methods as unknown as Database['public']['Tables']['profiles']['Update']['payment_methods'];

    const { error } = await supabaseClient
      .from('profiles')
      .update({ payment_methods: methodsAsJson })
      .eq('id', userId);

    if (error) {
      console.error('PaymentMethodRepository - error updating payment methods:', error);
      throw error;
    }
  }
}
