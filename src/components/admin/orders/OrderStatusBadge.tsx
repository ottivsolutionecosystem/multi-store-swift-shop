
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types/order-management';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const statusConfig = {
  pending: { label: 'Pendente', variant: 'secondary' as const },
  processing: { label: 'Processando', variant: 'default' as const },
  shipped: { label: 'Enviado', variant: 'outline' as const },
  delivered: { label: 'Entregue', variant: 'default' as const },
  cancelled: { label: 'Cancelado', variant: 'destructive' as const },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.pending;
  
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}
