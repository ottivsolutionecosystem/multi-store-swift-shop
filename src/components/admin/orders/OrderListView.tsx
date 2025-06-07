
import React from 'react';
import { OrderCard } from './OrderCard';
import { OrderWithItems } from '@/types/order-management';

interface OrderListViewProps {
  orders: OrderWithItems[];
  onViewDetails: (orderId: string) => void;
  onEdit: (orderId: string) => void;
}

export function OrderListView({ orders, onViewDetails, onEdit }: OrderListViewProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Nenhum pedido encontrado.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
