
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface ProductInventorySectionProps {
  stockQuantity: string;
  trackQuantity: boolean;
  continueSellingWhenOutOfStock: boolean;
  sku: string;
  barcode: string;
  onStockQuantityChange: (value: string) => void;
  onTrackQuantityChange: (value: boolean) => void;
  onContinueSellingChange: (value: boolean) => void;
  onSkuChange: (value: string) => void;
  onBarcodeChange: (value: string) => void;
}

export function ProductInventorySection({
  stockQuantity,
  trackQuantity,
  continueSellingWhenOutOfStock,
  sku,
  barcode,
  onStockQuantityChange,
  onTrackQuantityChange,
  onContinueSellingChange,
  onSkuChange,
  onBarcodeChange
}: ProductInventorySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estoque</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="track_quantity"
            checked={trackQuantity}
            onCheckedChange={onTrackQuantityChange}
          />
          <Label htmlFor="track_quantity">Acompanhar quantidade</Label>
        </div>

        {trackQuantity && (
          <>
            <div>
              <Label htmlFor="stock_quantity">Quantidade em Estoque *</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={stockQuantity}
                onChange={(e) => onStockQuantityChange(e.target.value)}
                required={trackQuantity}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="continue_selling"
                checked={continueSellingWhenOutOfStock}
                onCheckedChange={onContinueSellingChange}
              />
              <Label htmlFor="continue_selling">Continuar vendendo quando esgotado</Label>
            </div>
          </>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="sku">SKU (Código do Produto)</Label>
            <Input
              id="sku"
              value={sku}
              onChange={(e) => onSkuChange(e.target.value)}
              placeholder="SKU único"
            />
          </div>
          <div>
            <Label htmlFor="barcode">Código de Barras</Label>
            <Input
              id="barcode"
              value={barcode}
              onChange={(e) => onBarcodeChange(e.target.value)}
              placeholder="Código de barras"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
