
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Edit } from 'lucide-react';
import { OrderWithItems } from '@/types/order-management';
import { OrderStatusBadge } from './OrderStatusBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderCardProps {
  order: OrderWithItems;
  onViewDetails: (orderId: string) => void;
  onEdit: (orderId: string) => void;
}

export function OrderCard({ order, onViewDetails, onEdit }: OrderCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const hasPromotions = order.items.some(item => item.promotion_id);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              Pedido #{order.id.slice(-8)}
            </CardTitle>
            <p className="text-sm text-gray-600">
              {order.customer_name || order.customer_email || 'Cliente não informado'}
            </p>
          </div>
          <OrderStatusBadge status={order.status as any} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Data:</span>
            <span>{format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Itens:</span>
            <span>{order.items.length} produto(s)</span>
          </div>
          
          {hasPromotions && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Promoções:</span>
              <Badge variant="outline" className="text-xs">
                Aplicadas
              </Badge>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total:</span>
            <span className="font-semibold text-lg text-green-600">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(order.id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver Detalhes
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(order.id)}
              className="flex-1"
            >
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
