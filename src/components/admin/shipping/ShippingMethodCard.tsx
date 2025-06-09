
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShippingMethod } from '@/types/shipping';
import { Edit, Trash2, Truck, Globe } from 'lucide-react';

interface ShippingMethodCardProps {
  shippingMethod: ShippingMethod;
  onEdit: (shippingMethod: ShippingMethod) => void;
  onDelete: (id: string) => void;
}

export function ShippingMethodCard({ shippingMethod, onEdit, onDelete }: ShippingMethodCardProps) {
  const formatPrice = (price?: number) => {
    if (price === undefined) return '-';
    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const getDeliveryLabel = () => {
    if (shippingMethod.type === 'express') {
      if (shippingMethod.delivery_label_type === 'guaranteed') {
        return 'Entrega garantida';
      } else if (shippingMethod.delivery_days) {
        return `${shippingMethod.delivery_days} ${shippingMethod.delivery_days === 1 ? 'dia' : 'dias'}`;
      }
    }
    return 'Calculado pela API';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            {shippingMethod.type === 'express' ? (
              <Truck className="h-5 w-5 text-blue-600" />
            ) : (
              <Globe className="h-5 w-5 text-green-600" />
            )}
            {shippingMethod.name}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={shippingMethod.is_active ? 'default' : 'secondary'}>
              {shippingMethod.is_active ? 'Ativo' : 'Inativo'}
            </Badge>
            <Badge variant="outline">
              {shippingMethod.type === 'express' ? 'Expresso' : 'API'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600">Preço:</span>
            <p className="text-lg font-bold text-green-600">
              {shippingMethod.type === 'express' ? formatPrice(shippingMethod.price) : 'Calculado'}
            </p>
          </div>
          <div>
            <span className="font-medium text-gray-600">Prazo:</span>
            <p className="text-sm">{getDeliveryLabel()}</p>
          </div>
        </div>

        {shippingMethod.type === 'api' && shippingMethod.api_url && (
          <div className="text-sm">
            <span className="font-medium text-gray-600">URL da API:</span>
            <p className="text-xs text-gray-500 truncate">{shippingMethod.api_url}</p>
          </div>
        )}

        {shippingMethod.type === 'api' && shippingMethod.api_headers && Object.keys(shippingMethod.api_headers).length > 0 && (
          <div className="text-sm">
            <span className="font-medium text-gray-600">Headers configurados:</span>
            <p className="text-xs text-gray-500">{Object.keys(shippingMethod.api_headers).length} header(s)</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(shippingMethod)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(shippingMethod.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
