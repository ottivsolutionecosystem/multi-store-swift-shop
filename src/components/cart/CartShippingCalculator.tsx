
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator } from 'lucide-react';

interface CartShippingCalculatorProps {
  onCalculateShipping: () => void;
  calculating: boolean;
  cep: string;
  onCepChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function CartShippingCalculator({ 
  onCalculateShipping, 
  calculating, 
  cep, 
  onCepChange 
}: CartShippingCalculatorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calcular Frete
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="cep">CEP</Label>
          <div className="flex gap-2">
            <Input
              id="cep"
              placeholder="00000-000"
              value={cep}
              onChange={onCepChange}
              maxLength={9}
            />
            <Button 
              onClick={onCalculateShipping}
              disabled={calculating || !cep.trim()}
            >
              {calculating ? 'Calculando...' : 'Calcular'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
