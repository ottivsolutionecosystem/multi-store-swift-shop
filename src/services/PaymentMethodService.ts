
import { PaymentMethod, PaymentMethodFormData } from '@/types/payment-method';
import { UserSessionService } from './UserSessionService';
import { PaymentMethodRepository } from '@/repositories/PaymentMethodRepository';
import { PaymentMethodHelpers } from '@/lib/paymentMethodHelpers';

export class PaymentMethodService {
  private userSessionService: UserSessionService;
  private repository: PaymentMethodRepository;

  constructor() {
    this.userSessionService = new UserSessionService();
    this.repository = new PaymentMethodRepository();
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    console.log('PaymentMethodService - getting payment methods');
    
    try {
      const user = await this.userSessionService.getCurrentUser();
      if (!user) {
        console.log('PaymentMethodService - no authenticated user');
        return [];
      }

      const methods = await this.repository.getPaymentMethodsByUserId(user.id);
      console.log('PaymentMethodService - payment methods loaded:', methods.length);
      
      return methods;
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
      const newMethod = PaymentMethodHelpers.createNewPaymentMethod(data);

      // If this is set as default, remove default from others
      let updatedMethods = currentMethods;
      if (data.isDefault) {
        updatedMethods = PaymentMethodHelpers.removeDefaultFromOthers(currentMethods, newMethod.id);
      }

      updatedMethods.push(newMethod);

      await this.repository.updatePaymentMethods(user.id, updatedMethods);

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
      const existingMethod = PaymentMethodHelpers.findMethodById(currentMethods, methodId);
      
      if (!existingMethod) {
        throw new Error('Payment method not found');
      }

      // If setting as default, remove default from others
      let updatedMethods = currentMethods;
      if (data.isDefault) {
        updatedMethods = PaymentMethodHelpers.removeDefaultFromOthers(currentMethods, methodId);
      }

      // Update the specific method
      const updatedMethod = PaymentMethodHelpers.updatePaymentMethodData(existingMethod, data);
      const methodIndex = updatedMethods.findIndex(method => method.id === methodId);
      updatedMethods[methodIndex] = updatedMethod;

      await this.repository.updatePaymentMethods(user.id, updatedMethods);

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
      const updatedMethods = PaymentMethodHelpers.removeMethod(currentMethods, methodId);

      await this.repository.updatePaymentMethods(user.id, updatedMethods);

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
      const updatedMethods = PaymentMethodHelpers.setDefaultMethod(currentMethods, methodId);

      await this.repository.updatePaymentMethods(user.id, updatedMethods);

      console.log('PaymentMethodService - default payment method set successfully');
    } catch (error) {
      console.error('PaymentMethodService - error in setDefaultPaymentMethod:', error);
      throw error;
    }
  }
}
