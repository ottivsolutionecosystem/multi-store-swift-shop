
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Package, Upload } from 'lucide-react';

interface EmptyProductsStateProps {
  onCreateProduct: () => void;
}

export function EmptyProductsState({ onCreateProduct }: EmptyProductsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-md w-full text-center">
        {/* Ilustração */}
        <div className="mb-8">
          <div className="relative mx-auto w-32 h-32 mb-6">
            <div className="absolute inset-0 bg-blue-100 rounded-full flex items-center justify-center">
              <Package className="h-16 w-16 text-blue-500" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <Plus className="h-4 w-4 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Texto principal */}
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Adicione seus produtos
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          Comece criando seu primeiro produto. Adicione imagens, descrições e preços para começar a vender.
        </p>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <Button onClick={onCreateProduct} className="flex items-center gap-2 flex-1">
            <Plus className="h-4 w-4" />
            Adicionar produto
          </Button>
          <Button variant="outline" className="flex items-center gap-2 flex-1" disabled>
            <Upload className="h-4 w-4" />
            Importar produtos
          </Button>
        </div>

        {/* Cards de exemplo */}
        <div className="grid grid-cols-2 gap-3 opacity-50">
          <Card className="p-3">
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-100 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
          <Card className="p-3">
            <CardContent className="p-0">
              <div className="aspect-square bg-gray-100 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 bg-gray-200 rounded w-2/3"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
