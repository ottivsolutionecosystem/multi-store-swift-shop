
import { ShippingMethodRepository } from '@/repositories/ShippingMethodRepository';
import { ShippingMethod, ShippingCalculation, ProductDimensions } from '@/types/shipping';
import { CartItem } from '@/contexts/CartContext';

export class ShippingService {
  constructor(private shippingMethodRepository: ShippingMethodRepository) {}

  async getAllShippingMethods(): Promise<ShippingMethod[]> {
    return this.shippingMethodRepository.getAllShippingMethods();
  }

  async getActiveShippingMethods(): Promise<ShippingMethod[]> {
    return this.shippingMethodRepository.getActiveShippingMethods();
  }

  async getShippingMethodById(id: string): Promise<ShippingMethod | null> {
    return this.shippingMethodRepository.getShippingMethodById(id);
  }

  async createShippingMethod(shippingMethod: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>): Promise<ShippingMethod> {
    return this.shippingMethodRepository.createShippingMethod(shippingMethod);
  }

  async updateShippingMethod(id: string, updates: Partial<Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>>): Promise<ShippingMethod> {
    return this.shippingMethodRepository.updateShippingMethod(id, updates);
  }

  async deleteShippingMethod(id: string): Promise<void> {
    return this.shippingMethodRepository.deleteShippingMethod(id);
  }

  async calculateShipping(cartItems: CartItem[], cep?: string): Promise<ShippingCalculation[]> {
    console.log('ShippingService - calculating shipping for items:', cartItems.length);
    
    const activeMethods = await this.getActiveShippingMethods();
    const calculations: ShippingCalculation[] = [];

    // Calcular peso e dimensões totais do carrinho
    const totalDimensions = this.calculateTotalDimensions(cartItems);
    
    for (const method of activeMethods) {
      try {
        if (method.type === 'express') {
          const calculation = this.calculateExpressShipping(method, totalDimensions);
          calculations.push(calculation);
        } else if (method.type === 'api' && cep) {
          const calculation = await this.calculateApiShipping(method, totalDimensions, cep);
          calculations.push(calculation);
        }
      } catch (error) {
        console.error('ShippingService - error calculating shipping for method:', method.id, error);
        calculations.push({
          method_id: method.id,
          method_name: method.name,
          price: 0,
          error: 'Erro no cálculo do frete'
        });
      }
    }

    console.log('ShippingService - calculated shipping options:', calculations.length);
    return calculations;
  }

  private calculateTotalDimensions(cartItems: CartItem[]): ProductDimensions {
    let totalWeight = 0;
    let totalVolume = 0;
    
    // Calcular peso total e volume total
    cartItems.forEach(item => {
      const product = item.product;
      const quantity = item.quantity;
      
      if (product.weight) {
        totalWeight += product.weight * quantity;
      }
      
      if (product.length && product.width && product.height) {
        const itemVolume = (product.length * product.width * product.height) * quantity;
        totalVolume += itemVolume;
      }
    });

    // Calcular dimensões equivalentes para o volume total (assumindo formato cúbico)
    const equivalentSide = Math.cbrt(totalVolume);
    
    return {
      weight: totalWeight,
      length: equivalentSide,
      width: equivalentSide,
      height: equivalentSide
    };
  }

  private calculateExpressShipping(method: ShippingMethod, dimensions: ProductDimensions): ShippingCalculation {
    console.log('ShippingService - calculating express shipping:', method.name);
    
    let deliveryLabel = '';
    if (method.delivery_label_type === 'guaranteed') {
      deliveryLabel = 'Entrega garantida';
    } else if (method.delivery_days) {
      deliveryLabel = `${method.delivery_days} ${method.delivery_days === 1 ? 'dia' : 'dias'}`;
    }

    return {
      method_id: method.id,
      method_name: method.name,
      price: method.price || 0,
      delivery_days: method.delivery_days,
      delivery_label: deliveryLabel
    };
  }

  private async calculateApiShipping(method: ShippingMethod, dimensions: ProductDimensions, cep: string): Promise<ShippingCalculation> {
    console.log('ShippingService - calculating API shipping:', method.name, 'CEP:', cep);
    
    if (!method.api_url) {
      throw new Error('URL da API não configurada');
    }

    const payload = {
      cep,
      weight: dimensions.weight,
      length: dimensions.length,
      width: dimensions.width,
      height: dimensions.height
    };

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...method.api_headers
    };

    try {
      const response = await fetch(method.api_url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API retornou status ${response.status}`);
      }

      const data = await response.json();
      
      return {
        method_id: method.id,
        method_name: method.name,
        price: data.price || 0,
        delivery_days: data.delivery_days,
        delivery_label: data.delivery_label || (data.delivery_days ? `${data.delivery_days} ${data.delivery_days === 1 ? 'dia' : 'dias'}` : '')
      };
    } catch (error) {
      console.error('ShippingService - API shipping error:', error);
      throw new Error('Erro ao consultar API de frete');
    }
  }
}
