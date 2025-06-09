
import { ShippingMethodRepository } from '@/repositories/ShippingMethodRepository';
import { ShippingMethod } from '@/types/shipping';

export class ShippingService {
  constructor(private shippingMethodRepository: ShippingMethodRepository) {}

  async getShippingMethods(): Promise<ShippingMethod[]> {
    console.log('ShippingService - Getting shipping methods');
    return this.shippingMethodRepository.findAll();
  }

  async getActiveShippingMethods(): Promise<ShippingMethod[]> {
    console.log('ShippingService - Getting active shipping methods');
    return this.shippingMethodRepository.findActive();
  }

  async getShippingMethodById(id: string): Promise<ShippingMethod | null> {
    console.log('ShippingService - Getting shipping method by id:', id);
    return this.shippingMethodRepository.findById(id);
  }

  async createShippingMethod(method: Omit<ShippingMethod, 'id' | 'created_at' | 'updated_at'>): Promise<ShippingMethod> {
    console.log('ShippingService - Creating shipping method:', method);
    return this.shippingMethodRepository.create(method);
  }

  async updateShippingMethod(id: string, method: Partial<Omit<ShippingMethod, 'id' | 'created_at' | 'updated_at'>>): Promise<ShippingMethod> {
    console.log('ShippingService - Updating shipping method:', id, method);
    return this.shippingMethodRepository.update(id, method);
  }

  async deleteShippingMethod(id: string): Promise<void> {
    console.log('ShippingService - Deleting shipping method:', id);
    return this.shippingMethodRepository.delete(id);
  }

  async calculateShipping(zipCode: string, items: any[]): Promise<{ method: string; price: number; days?: number }[]> {
    console.log('ShippingService - Calculating shipping for:', zipCode, items);
    
    const methods = await this.getActiveShippingMethods();
    
    return methods.map(method => ({
      method: method.name,
      price: method.price || 0,
      days: method.delivery_days || undefined,
    }));
  }
}
