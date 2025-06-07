
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit } from 'lucide-react';
import { OrderWithItems } from '@/types/order-management';
import { OrderStatusBadge } from './OrderStatusBadge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderTableViewProps {
  orders: OrderWithItems[];
  onViewDetails: (orderId: string) => void;
  onEdit: (orderId: string) => void;
}

export function OrderTableView({ orders, onViewDetails, onEdit }: OrderTableViewProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum pedido encontrado.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const hasPromotions = order.items.some(item => item.promotion_id);
            
            return (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  #{order.id.slice(-8)}
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {order.customer_name || 'Não informado'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer_email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {format(new Date(order.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                </TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status as any} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>{order.items.length} item(s)</span>
                    {hasPromotions && (
                      <Badge variant="outline" className="text-xs">
                        Promoção
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-semibold text-green-600">
                  {formatCurrency(order.total_amount)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewDetails(order.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(order.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
