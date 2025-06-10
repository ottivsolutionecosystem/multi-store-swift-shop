
import { PaymentMethod, PaymentMethodFormData } from '@/types/payment-method';

export class PaymentMethodHelpers {
  static createNewPaymentMethod(data: PaymentMethodFormData): PaymentMethod {
    return {
      id: crypto.randomUUID(),
      type: data.type,
      provider: data.provider,
      lastFourDigits: data.cardNumber ? data.cardNumber.slice(-4) : '',
      cardholderName: data.cardholderName,
      expiryMonth: data.expiryMonth,
      expiryYear: data.expiryYear,
      isDefault: data.isDefault,
      isActive: true,
      consentGiven: true,
      consentDate: new Date().toISOString(),
      dataRetentionUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
      createdAt: new Date().toISOString()
    };
  }

  static updatePaymentMethodData(
    existingMethod: PaymentMethod, 
    updateData: Partial<PaymentMethodFormData>
  ): PaymentMethod {
    return {
      ...existingMethod,
      ...updateData,
      lastFourDigits: updateData.cardNumber ? 
        updateData.cardNumber.slice(-4) : 
        existingMethod.lastFourDigits
    };
  }

  static setDefaultMethod(methods: PaymentMethod[], targetMethodId: string): PaymentMethod[] {
    return methods.map(method => ({
      ...method,
      isDefault: method.id === targetMethodId
    }));
  }

  static removeDefaultFromOthers(methods: PaymentMethod[], exceptMethodId: string): PaymentMethod[] {
    return methods.map(method => ({
      ...method,
      isDefault: method.id === exceptMethodId ? method.isDefault : false
    }));
  }

  static removeMethod(methods: PaymentMethod[], methodId: string): PaymentMethod[] {
    return methods.filter(method => method.id !== methodId);
  }

  static findMethodById(methods: PaymentMethod[], methodId: string): PaymentMethod | undefined {
    return methods.find(method => method.id === methodId);
  }
}
