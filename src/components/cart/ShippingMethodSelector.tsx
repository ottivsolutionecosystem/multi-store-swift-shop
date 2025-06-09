
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Truck, Clock, AlertCircle } from 'lucide-react';
import { ShippingCalculation } from '@/types/shipping';

interface ShippingMethodSelectorProps {
  calculations: ShippingCalculation[];
  selectedMethodId?: string;
  onMethodSelect: (methodId: string, price: number) => void;
  loading?: boolean;
}

export function ShippingMethodSelector({ 
  calculations, 
  selectedMethodId, 
  onMethodSelect, 
  loading 
}: ShippingMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState(selectedMethodId || '');

  useEffect(() => {
    if (selectedMethodId) {
      setSelectedMethod(selectedMethodId);
    }
  }, [selectedMethodId]);

  const handleMethodChange = (methodId: string) => {
    setSelectedMethod(methodId);
    const calculation = calculations.find(c => c.method_id === methodId);
    if (calculation) {
      onMethodSelect(methodId, calculation.price);
    }
  };

  const formatPrice = (price: number) => {
    return price === 0 
      ? 'Grátis' 
      : price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Opções de Frete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (calculations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5" />
            Opções de Frete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <AlertCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Nenhuma opção de frete disponível</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Opções de Frete
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethod} onValueChange={handleMethodChange}>
          {calculations.map((calculation) => (
            <div key={calculation.method_id} className="flex items-center space-x-2 p-3 border rounded-md hover:bg-gray-50">
              <RadioGroupItem value={calculation.method_id} id={calculation.method_id} />
              <div className="flex-1">
                <Label htmlFor={calculation.method_id} className="cursor-pointer">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{calculation.method_name}</p>
                      {calculation.delivery_label && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {calculation.delivery_label}
                        </p>
                      )}
                      {calculation.error && (
                        <p className="text-sm text-red-600">{calculation.error}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">
                        {formatPrice(calculation.price)}
                      </p>
                    </div>
                  </div>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
