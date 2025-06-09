
import { ShippingMethodRepository } from '@/repositories/ShippingMethodRepository';
import { ShippingCalculation, ShippingMethod } from '@/types/shipping';

interface CartItem {
  product: {
    id: string;
    name: string;
    weight?: number;
  };
  quantity: number;
}

export class ShippingService {
  constructor(private shippingMethodRepository: ShippingMethodRepository) {}

  async getAllShippingMethods(): Promise<ShippingMethod[]> {
    return this.shippingMethodRepository.getAllShippingMethods();
  }

  async getActiveShippingMethods(): Promise<ShippingMethod[]> {
    return this.shippingMethodRepository.getActiveShippingMethods();
  }

  async createShippingMethod(methodData: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>): Promise<ShippingMethod> {
    return this.shippingMethodRepository.createShippingMethod(methodData);
  }

  async updateShippingMethod(id: string, methodData: Partial<Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>>): Promise<ShippingMethod> {
    return this.shippingMethodRepository.updateShippingMethod(id, methodData);
  }

  async deleteShippingMethod(id: string): Promise<void> {
    return this.shippingMethodRepository.deleteShippingMethod(id);
  }

  async calculateShipping(items: CartItem[], destinationZipCode: string): Promise<ShippingCalculation[]> {
    const activeMethods = await this.getActiveShippingMethods();
    const calculations: ShippingCalculation[] = [];

    for (const method of activeMethods) {
      try {
        let calculatedPrice = method.price || 0;
        let deliveryDays = method.delivery_days || 5;

        // Para métodos de API externa, fazer cálculo via API
        if (method.type === 'api' && method.api_url) {
          const apiResult = await this.calculateExternalShipping(method, items, destinationZipCode);
          calculatedPrice = apiResult.price;
          deliveryDays = apiResult.days;
        }

        calculations.push({
          method_id: method.id,
          method_name: method.name,
          price: calculatedPrice,
          delivery_days: deliveryDays,
          delivery_label: method.delivery_label_type || 'days',
          error: null,
        });
      } catch (error) {
        console.error(`Error calculating shipping for method ${method.name}:`, error);
        calculations.push({
          method_id: method.id,
          method_name: method.name,
          price: 0,
          delivery_days: 0,
          delivery_label: 'days',
          error: 'Erro ao calcular frete',
        });
      }
    }

    return calculations;
  }

  private async calculateExternalShipping(
    method: ShippingMethod,
    items: CartItem[],
    destinationZipCode: string
  ): Promise<{ price: number; days: number }> {
    // Implementação simplificada para cálculo externo
    // Em produção, integraria com APIs como Correios, Jadlog, etc.
    
    const totalWeight = items.reduce((sum, item) => {
      return sum + (item.product.weight || 0.5) * item.quantity;
    }, 0);

    // Simulação de cálculo baseado em peso e distância
    const basePrice = method.price || 10;
    const weightFactor = totalWeight * 2;
    const calculatedPrice = basePrice + weightFactor;

    return {
      price: calculatedPrice,
      days: method.delivery_days || 5,
    };
  }
}
