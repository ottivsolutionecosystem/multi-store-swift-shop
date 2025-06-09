
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShippingMethodForm } from './ShippingMethodForm';
import { ShippingMethod } from '@/types/shipping';

interface ShippingMethodFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingMethod: ShippingMethod | null;
  onSubmit: (data: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  loading?: boolean;
}

export function ShippingMethodFormDialog({ 
  open, 
  onOpenChange, 
  editingMethod, 
  onSubmit, 
  loading 
}: ShippingMethodFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingMethod ? 'Editar Método de Frete' : 'Novo Método de Frete'}
          </DialogTitle>
        </DialogHeader>
        <ShippingMethodForm
          shippingMethod={editingMethod}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
}
