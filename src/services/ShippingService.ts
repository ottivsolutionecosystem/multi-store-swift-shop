
import { ShippingMethodRepository } from '@/repositories/ShippingMethodRepository';
import { ShippingMethod, ShippingCalculation } from '@/types/shipping';

export class ShippingService {
  constructor(private shippingMethodRepository: ShippingMethodRepository) {}

  async getShippingMethods(): Promise<ShippingMethod[]> {
    console.log('ShippingService - Getting shipping methods');
    return this.shippingMethodRepository.getAllShippingMethods();
  }

  async getActiveShippingMethods(): Promise<ShippingMethod[]> {
    console.log('ShippingService - Getting active shipping methods');
    return this.shippingMethodRepository.getActiveShippingMethods();
  }

  async getShippingMethodById(id: string): Promise<ShippingMethod | null> {
    console.log('ShippingService - Getting shipping method by id:', id);
    return this.shippingMethodRepository.getShippingMethodById(id);
  }

  async createShippingMethod(method: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>): Promise<ShippingMethod> {
    console.log('ShippingService - Creating shipping method:', method);
    return this.shippingMethodRepository.createShippingMethod(method);
  }

  async updateShippingMethod(id: string, method: Partial<Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>>): Promise<ShippingMethod> {
    console.log('ShippingService - Updating shipping method:', id, method);
    return this.shippingMethodRepository.updateShippingMethod(id, method);
  }

  async deleteShippingMethod(id: string): Promise<void> {
    console.log('ShippingService - Deleting shipping method:', id);
    return this.shippingMethodRepository.deleteShippingMethod(id);
  }

  async calculateShipping(items: any[], zipCode: string): Promise<ShippingCalculation[]> {
    console.log('ShippingService - Calculating shipping for:', zipCode, items);
    
    // Usar métodos ativos para cálculo de frete (acessível publicamente)
    const methods = await this.getActiveShippingMethods();
    
    return methods.map(method => ({
      method_id: method.id,
      method_name: method.name,
      price: method.price || 0,
      delivery_days: method.delivery_days || undefined,
      delivery_label: method.delivery_days ? `${method.delivery_days} dias` : undefined,
    }));
  }
}
