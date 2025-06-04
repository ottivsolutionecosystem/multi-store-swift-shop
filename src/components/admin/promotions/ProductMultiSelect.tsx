
import React, { useMemo, useCallback } from 'react';
import { UseFormSetValue, UseFormWatch, FieldErrors } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { PromotionFormData } from '@/types/promotion';

interface ProductMultiSelectProps {
  setValue: UseFormSetValue<PromotionFormData>;
  watch: UseFormWatch<PromotionFormData>;
  errors: FieldErrors<PromotionFormData>;
  products: any[];
}

export function ProductMultiSelect({ setValue, watch, errors, products = [] }: ProductMultiSelectProps) {
  const selectedProductIds = watch('product_ids') || [];

  const safeProducts = useMemo(() => {
    if (!Array.isArray(products)) {
      console.warn('⚠️ ProductMultiSelect - Products is not an array:', products);
      return [];
    }
    const result = products.filter(p => p && p.id && p.name);
    console.log('🔧 ProductMultiSelect - Safe products count:', result.length);
    return result;
  }, [products]);

  const productOptions = useMemo(() => {
    const options = safeProducts.map(product => ({
      value: product.id,
      label: product.name
    }));
    console.log('🔧 ProductMultiSelect - Product options created:', options.length);
    return options;
  }, [safeProducts]);

  const safeSelectedProductIds = useMemo(() => {
    const result = Array.isArray(selectedProductIds) ? selectedProductIds : [];
    console.log('🔧 ProductMultiSelect - Safe product IDs:', result);
    return result;
  }, [selectedProductIds]);

  const handleProductSelection = useCallback((selected: string[]) => {
    console.log('🔧 ProductMultiSelect - Selection handler called:', selected);
    
    try {
      if (!Array.isArray(selected)) {
        console.error('❌ ProductMultiSelect - Invalid selection:', selected);
        return;
      }
      
      const validSelection = selected.filter(id => typeof id === 'string' && id.trim());
      console.log('🔧 ProductMultiSelect - Setting product_ids:', validSelection);
      
      setValue('product_ids', validSelection, { shouldValidate: true });
    } catch (error) {
      console.error('❌ ProductMultiSelect - Error in selection:', error);
    }
  }, [setValue]);

  return (
    <div className="space-y-2">
      <Label htmlFor="product_ids">Produtos *</Label>
      {productOptions.length > 0 ? (
        <MultiSelect
          options={productOptions}
          selected={safeSelectedProductIds}
          onSelectionChange={handleProductSelection}
          placeholder="Selecione os produtos..."
          searchPlaceholder="Buscar produtos..."
          emptyText="Nenhum produto encontrado"
        />
      ) : (
        <div className="p-4 text-center text-gray-500 border rounded-md">
          Carregando produtos...
        </div>
      )}
      {errors.product_ids && (
        <p className="text-sm text-red-600">{errors.product_ids.message}</p>
      )}
      <p className="text-sm text-gray-500">
        Selecione um ou mais produtos para aplicar a promoção
      </p>
    </div>
  );
}
