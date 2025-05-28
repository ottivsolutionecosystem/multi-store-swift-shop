
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database } from '@/integrations/supabase/types';
import { Package } from 'lucide-react';

type Product = Database['public']['Tables']['products']['Row'];

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="aspect-square relative overflow-hidden rounded-t-lg">
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>
        <div className="p-4 pb-2">
          <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-4 pb-2">
        {product.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">{product.description}</p>
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
      <CardFooter className="p-4 pt-2">
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
