
import { ShippingMethodRepository } from '@/repositories/ShippingMethodRepository';
import { Database } from '@/integrations/supabase/types';
import { ShippingCalculation } from '@/types/shipping';

type ShippingMethod = Database['public']['Tables']['shipping_methods']['Row'];
type ShippingMethodInsert = Database['public']['Tables']['shipping_methods']['Insert'];
type ShippingMethodUpdate = Database['public']['Tables']['shipping_methods']['Update'];

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
    return this.shippingMethodRepository.findAll();
  }

  async getActiveShippingMethods(): Promise<ShippingMethod[]> {
    return this.shippingMethodRepository.findActive();
  }

  async createShippingMethod(methodData: Omit<ShippingMethodInsert, 'store_id'>): Promise<ShippingMethod> {
    return this.shippingMethodRepository.create(methodData);
  }

  async updateShippingMethod(id: string, methodData: ShippingMethodUpdate): Promise<ShippingMethod> {
    return this.shippingMethodRepository.update(id, methodData);
  }

  async deleteShippingMethod(id: string): Promise<void> {
    return this.shippingMethodRepository.delete(id);
  }

  async calculateShipping(items: CartItem[], destinationZipCode: string): Promise<ShippingCalculation[]> {
    const activeMethods = await this.getActiveShippingMethods();
    const calculations: ShippingCalculation[] = [];

    for (const method of activeMethods) {
      try {
        let calculatedPrice = method.price || 0;
        let estimatedDays = method.delivery_days || 5;

        // Para métodos de API externa, fazer cálculo via API
        if (method.type === 'api' && method.api_url) {
          const apiResult = await this.calculateExternalShipping(method, items, destinationZipCode);
          calculatedPrice = apiResult.price;
          estimatedDays = apiResult.days;
        }

        calculations.push({
          method_id: method.id,
          method_name: method.name,
          price: calculatedPrice,
          estimated_days: estimatedDays,
          delivery_label: method.delivery_label_type || 'days',
          error: null,
        });
      } catch (error) {
        console.error(`Error calculating shipping for method ${method.name}:`, error);
        calculations.push({
          method_id: method.id,
          method_name: method.name,
          price: 0,
          estimated_days: 0,
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
