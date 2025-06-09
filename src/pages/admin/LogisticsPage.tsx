import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useShippingMethods } from '@/hooks/useShippingMethods';
import { Header } from '@/components/layout/Header';
import { LogisticsHeader } from '@/components/admin/shipping/LogisticsHeader';
import { ShippingMethodsEmptyState } from '@/components/admin/shipping/ShippingMethodsEmptyState';
import { ShippingMethodsGrid } from '@/components/admin/shipping/ShippingMethodsGrid';
import { ShippingMethodFormDialog } from '@/components/admin/shipping/ShippingMethodFormDialog';
import { ShippingMethodDeleteDialog } from '@/components/admin/shipping/ShippingMethodDeleteDialog';
import { ShippingMethod } from '@/types/shipping';

export default function LogisticsPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { 
    shippingMethods, 
    loading, 
    submitting, 
    createMethod, 
    updateMethod, 
    deleteMethod 
  } = useShippingMethods();

  const [showForm, setShowForm] = useState(false);
  const [editingMethod, setEditingMethod] = useState<ShippingMethod | null>(null);
  const [deletingMethodId, setDeletingMethodId] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/auth');
      } else if (profile?.role !== 'admin') {
        navigate('/');
      }
    }
  }, [user, profile, authLoading, navigate]);

  const handleCreateMethod = async (data: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>) => {
    try {
      await createMethod(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleEditMethod = (method: ShippingMethod) => {
    setEditingMethod(method);
    setShowForm(true);
  };

  const handleDeleteMethod = async () => {
    if (!deletingMethodId) return;
    
    try {
      await deleteMethod(deletingMethodId);
    } finally {
      setDeletingMethodId(null);
    }
  };

  const handleSubmitMethod = async (data: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingMethod) {
        await updateMethod(editingMethod.id, data);
      } else {
        await createMethod(data);
      }
      
      setShowForm(false);
      setEditingMethod(null);
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  if (authLoading || loading) {
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
        <LogisticsHeader onCreateMethod={() => setIsCreateDialogOpen(true)} />

        {shippingMethods.length === 0 ? (
          <ShippingMethodsEmptyState onCreateMethod={() => setIsCreateDialogOpen(true)} />
        ) : (
          <ShippingMethodsGrid
            shippingMethods={shippingMethods}
            onEdit={handleEditMethod}
            onDelete={(id) => setDeletingMethodId(id)}
          />
        )}

        <ShippingMethodFormDialog
          open={showForm}
          onOpenChange={setShowForm}
          editingMethod={editingMethod}
          onSubmit={handleSubmitMethod}
          loading={submitting}
        />

        <ShippingMethodDeleteDialog
          open={!!deletingMethodId}
          onOpenChange={() => setDeletingMethodId(null)}
          onConfirm={handleDeleteMethod}
          loading={submitting}
        />
      </main>
    </div>
  );
}
