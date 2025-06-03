
import { VariantRepository, VariantWithValues } from '@/repositories/VariantRepository';
import { VariantData } from '@/types/variant';

export class VariantManagementService {
  constructor(private variantRepository: VariantRepository) {}

  async getProductVariants(productId: string): Promise<VariantWithValues[]> {
    console.log('VariantManagementService - getting variants for product:', productId);
    try {
      const variants = await this.variantRepository.getVariantsByProduct(productId);
      console.log('VariantManagementService - variants loaded:', variants);
      return variants;
    } catch (error) {
      console.error('VariantManagementService - error getting variants:', error);
      throw error;
    }
  }

  async createProductVariants(productId: string, variants: VariantData[]): Promise<void> {
    console.log('VariantManagementService - creating variants for product:', productId, variants);
    try {
      for (const [index, variantData] of variants.entries()) {
        const variant = await this.variantRepository.createVariant({
          product_id: productId,
          name: variantData.name,
          position: index
        });

        for (const [valueIndex, value] of variantData.values.entries()) {
          await this.variantRepository.createVariantValue({
            variant_id: variant.id,
            value: value,
            position: valueIndex
          });
        }
      }
      console.log('VariantManagementService - variants created successfully');
    } catch (error) {
      console.error('VariantManagementService - error creating variants:', error);
      throw error;
    }
  }

  async deleteVariant(variantId: string): Promise<void> {
    console.log('VariantManagementService - deleting variant:', variantId);
    try {
      await this.variantRepository.deleteVariant(variantId);
      console.log('VariantManagementService - variant deleted successfully');
    } catch (error) {
      console.error('VariantManagementService - error deleting variant:', error);
      throw error;
    }
  }
}
