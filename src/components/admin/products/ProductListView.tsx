
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { ProductWithPromotion } from '@/repositories/ProductRepository';

interface ProductListViewProps {
  products: ProductWithPromotion[];
  onEdit: (productId: string) => void;
  onDelete: (productId: string) => void;
}

export function ProductListView({ products, onEdit, onDelete }: ProductListViewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
              {product.image_url ? (
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="font-semibold text-lg truncate">{product.name}</h3>
              
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  R$ {Number(product.price).toFixed(2)}
                </span>
                <Badge variant={product.is_active ? 'default' : 'secondary'}>
                  {product.is_active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>

              {product.category && (
                <p className="text-sm text-gray-600">
                  Categoria: {product.category.name}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>Estoque: {product.stock_quantity}</span>
                {product.stock_quantity <= 0 && (
                  <Badge variant="destructive" className="text-xs">
                    Sem estoque
                  </Badge>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEdit(product.id)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={() => onDelete(product.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
