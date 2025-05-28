
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from '@/integrations/supabase/types';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {product.description && (
          <p className="text-gray-600 text-sm mb-4">{product.description}</p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">
            R$ {Number(product.price).toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            Estoque: {product.stock_quantity}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onAddToCart?.(product)}
          disabled={product.stock_quantity === 0}
        >
          {product.stock_quantity === 0 ? 'Fora de Estoque' : 'Adicionar ao Carrinho'}
        </Button>
      </CardFooter>
    </Card>
  );
}
