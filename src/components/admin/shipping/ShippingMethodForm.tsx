
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HeadersManager } from './HeadersManager';
import { ShippingMethod, ShippingMethodType, DeliveryLabelType } from '@/types/shipping';

interface ShippingMethodFormProps {
  shippingMethod?: ShippingMethod | null;
  onSubmit: (data: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ShippingMethodForm({ shippingMethod, onSubmit, onCancel, loading }: ShippingMethodFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'express' as ShippingMethodType,
    is_active: true,
    price: '',
    delivery_days: '',
    delivery_label_type: 'days' as DeliveryLabelType,
    api_url: '',
    api_headers: {} as Record<string, string>
  });

  useEffect(() => {
    if (shippingMethod) {
      setFormData({
        name: shippingMethod.name,
        type: shippingMethod.type,
        is_active: shippingMethod.is_active,
        price: shippingMethod.price?.toString() || '',
        delivery_days: shippingMethod.delivery_days?.toString() || '',
        delivery_label_type: shippingMethod.delivery_label_type || 'days',
        api_url: shippingMethod.api_url || '',
        api_headers: shippingMethod.api_headers || {}
      });
    }
  }, [shippingMethod]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData: Omit<ShippingMethod, 'id' | 'store_id' | 'created_at' | 'updated_at'> = {
      name: formData.name,
      type: formData.type,
      is_active: formData.is_active,
      price: formData.type === 'express' && formData.price ? parseFloat(formData.price) : undefined,
      delivery_days: formData.type === 'express' && formData.delivery_days ? parseInt(formData.delivery_days) : undefined,
      delivery_label_type: formData.type === 'express' ? formData.delivery_label_type : undefined,
      api_url: formData.type === 'api' ? formData.api_url : undefined,
      api_headers: formData.type === 'api' ? formData.api_headers : undefined
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
              placeholder="Ex: Entrega Expressa, PAC, SEDEX"
            />
          </div>

          <div>
            <Label htmlFor="type">Tipo de Frete *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: ShippingMethodType) => setFormData({...formData, type: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="express">Frete Expresso</SelectItem>
                <SelectItem value="api">Frete por API</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
            />
            <Label htmlFor="active">Método Ativo</Label>
          </div>
        </CardContent>
      </Card>

      <Tabs value={formData.type} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="express">Frete Expresso</TabsTrigger>
          <TabsTrigger value="api">Frete por API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="express">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Frete Expresso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="price">Preço (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required={formData.type === 'express'}
                  placeholder="0.00"
                />
              </div>

              <div>
                <Label htmlFor="delivery_days">Prazo de Entrega (dias)</Label>
                <Input
                  id="delivery_days"
                  type="number"
                  value={formData.delivery_days}
                  onChange={(e) => setFormData({...formData, delivery_days: e.target.value})}
                  placeholder="Ex: 3"
                />
              </div>

              <div>
                <Label htmlFor="delivery_label_type">Tipo de Exibição do Prazo</Label>
                <Select
                  value={formData.delivery_label_type}
                  onValueChange={(value: DeliveryLabelType) => setFormData({...formData, delivery_label_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">Mostrar em dias</SelectItem>
                    <SelectItem value="guaranteed">Mostrar "Entrega garantida"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="api_url">URL da API *</Label>
                  <Input
                    id="api_url"
                    type="url"
                    value={formData.api_url}
                    onChange={(e) => setFormData({...formData, api_url: e.target.value})}
                    required={formData.type === 'api'}
                    placeholder="https://api.exemplo.com/calcular-frete"
                  />
                </div>
              </CardContent>
            </Card>

            <HeadersManager
              headers={formData.api_headers}
              onChange={(headers) => setFormData({...formData, api_headers: headers})}
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : (shippingMethod ? 'Atualizar' : 'Criar')} Método
        </Button>
      </div>
    </form>
  );
}
