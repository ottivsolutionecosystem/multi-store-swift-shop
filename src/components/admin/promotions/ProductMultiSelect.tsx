
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

  // Validação robusta dos produtos
  const safeProducts = useMemo(() => {
    console.log('🔧 ProductMultiSelect - Processing products:', products);
    
    if (!Array.isArray(products)) {
      console.warn('⚠️ ProductMultiSelect - Products is not an array:', typeof products);
      return [];
    }
    
    const result = products.filter(p => {
      const isValid = p && 
        typeof p.id === 'string' && 
        typeof p.name === 'string' && 
        p.id.trim() && 
        p.name.trim();
      
      if (!isValid) {
        console.warn('⚠️ ProductMultiSelect - Invalid product filtered out:', p);
      }
      
      return isValid;
    });
    
    console.log('🔧 ProductMultiSelect - Safe products count:', result.length);
    return result;
  }, [products]);

  const productOptions = useMemo(() => {
    console.log('🔧 ProductMultiSelect - Creating options from products:', safeProducts.length);
    
    const options = safeProducts.map(product => ({
      value: product.id,
      label: product.name
    }));
    
    console.log('🔧 ProductMultiSelect - Product options created:', options);
    return options;
  }, [safeProducts]);

  const safeSelectedProductIds = useMemo(() => {
    console.log('🔧 ProductMultiSelect - Processing selected IDs:', selectedProductIds);
    
    if (!Array.isArray(selectedProductIds)) {
      console.warn('⚠️ ProductMultiSelect - Selected IDs not an array:', typeof selectedProductIds);
      return [];
    }
    
    const result = selectedProductIds.filter(id => 
      typeof id === 'string' && id.trim()
    );
    
    console.log('🔧 ProductMultiSelect - Safe product IDs:', result);
    return result;
  }, [selectedProductIds]);

  const handleProductSelection = useCallback((selected: string[]) => {
    console.log('🔧 ProductMultiSelect - Selection handler called:', selected);
    
    try {
      // Validação adicional
      if (!Array.isArray(selected)) {
        console.error('❌ ProductMultiSelect - Invalid selection type:', typeof selected);
        return;
      }
      
      const validSelection = selected.filter(id => 
        typeof id === 'string' && 
        id.trim() &&
        safeProducts.some(p => p.id === id) // Verificar se o ID existe nos produtos
      );
      
      console.log('🔧 ProductMultiSelect - Valid selection processed:', validSelection);
      console.log('🔧 ProductMultiSelect - Setting product_ids in form');
      
      setValue('product_ids', validSelection, { shouldValidate: true });
    } catch (error) {
      console.error('❌ ProductMultiSelect - Error in selection:', error);
    }
  }, [setValue, safeProducts]);

  // Validação antes de renderizar o MultiSelect
  const shouldRenderMultiSelect = productOptions.length > 0 && Array.isArray(safeSelectedProductIds);

  console.log('🔧 ProductMultiSelect render decision:', {
    shouldRender: shouldRenderMultiSelect,
    optionsCount: productOptions.length,
    selectedIsArray: Array.isArray(safeSelectedProductIds),
    selectedCount: safeSelectedProductIds.length
  });

  return (
    <div className="space-y-2">
      <Label htmlFor="product_ids">Produtos *</Label>
      {shouldRenderMultiSelect ? (
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
          {safeProducts.length === 0 ? 'Carregando produtos...' : 'Erro ao carregar seleção de produtos'}
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
