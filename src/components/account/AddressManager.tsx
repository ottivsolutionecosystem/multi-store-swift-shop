
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { useUserAddresses } from '@/hooks/useUserAddresses';
import { AddressFormDialog } from './AddressFormDialog';
import { UserAddress } from '@/types/user-address';

export function AddressManager() {
  const { addresses, isLoading, deleteAddress, setDefaultAddress } = useUserAddresses();
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = (address: UserAddress) => {
    setEditingAddress(address);
    setIsDialogOpen(true);
  };

  const handleNew = () => {
    setEditingAddress(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingAddress(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este endereço?')) {
      deleteAddress(id);
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultAddress(id);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Meus Endereços
          </CardTitle>
          <Button onClick={handleNew} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Novo Endereço
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Nenhum endereço cadastrado</p>
              <p className="text-sm mb-4">Adicione um endereço para facilitar suas compras</p>
              <Button onClick={handleNew}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Endereço
              </Button>
            </div>
          ) : (
            addresses.map((address) => (
              <div key={address.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{address.name}</h4>
                      {address.is_default && (
                        <Badge variant="secondary">Padrão</Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>{address.street}, {address.number}</p>
                      {address.complement && <p>{address.complement}</p>}
                      <p>{address.neighborhood}</p>
                      <p>{address.city} - {address.state}</p>
                      <p>CEP: {address.zip_code}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(address)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(address.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {!address.is_default && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="w-full"
                  >
                    Definir como Padrão
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <AddressFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        address={editingAddress}
        onClose={handleCloseDialog}
      />
    </>
  );
}
