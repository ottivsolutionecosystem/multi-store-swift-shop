
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { OrderViewToggle } from '@/components/admin/orders/OrderViewToggle';
import { OrderFilters } from '@/components/admin/orders/OrderFilters';
import { OrderSort } from '@/components/admin/orders/OrderSort';
import { OrderListView } from '@/components/admin/orders/OrderListView';
import { OrderTableView } from '@/components/admin/orders/OrderTableView';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { useOrderData } from '@/hooks/useOrderData';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const {
    viewMode,
    filters,
    sort,
    setViewMode,
    setFilters,
    setSort,
    resetFilters,
  } = useOrderManagement();

  const { data: orders = [], isLoading, error } = useOrderData(filters, sort);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate('/auth');
      } else if (profile?.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, profile, loading, navigate]);

  const handleViewDetails = (orderId: string) => {
    console.log('Visualizar detalhes do pedido:', orderId);
    // TODO: Implementar modal ou página de detalhes
  };

  const handleEdit = (orderId: string) => {
    console.log('Editar pedido:', orderId);
    // TODO: Implementar modal ou página de edição
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || profile?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gerenciar Pedidos</h1>
        </div>

        <div className="space-y-6">
          <OrderFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <OrderSort sort={sort} onSortChange={setSort} />
              <p className="text-sm text-gray-600">
                {orders.length} pedido(s) encontrado(s)
              </p>
            </div>
            <OrderViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">Erro ao carregar pedidos: {error.message}</p>
            </div>
          ) : viewMode === 'list' ? (
            <OrderListView
              orders={orders}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
            />
          ) : (
            <OrderTableView
              orders={orders}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
            />
          )}
        </div>
      </main>
    </div>
  );
}
