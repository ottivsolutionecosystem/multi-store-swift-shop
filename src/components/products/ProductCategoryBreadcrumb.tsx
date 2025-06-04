
import React from 'react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ProductWithPromotion } from '@/repositories/ProductRepository';
import { useStoreSettings } from '@/hooks/useStoreSettings';

interface ProductCategoryBreadcrumbProps {
  product: ProductWithPromotion;
}

export function ProductCategoryBreadcrumb({ product }: ProductCategoryBreadcrumbProps) {
  const { storeSettings } = useStoreSettings();
  const showCategory = storeSettings?.show_category ?? true;

  if (!showCategory || !product.category) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-xs leading-none">
        {product.category.parent_category ? (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-gray-500 hover:text-gray-700">
                {product.category.parent_category.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-gray-600">
                {product.category.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        ) : (
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-600">
              {product.category.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
