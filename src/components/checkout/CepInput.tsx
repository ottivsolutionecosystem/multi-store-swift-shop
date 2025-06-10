
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, MapPin } from 'lucide-react';

interface CepInputProps {
  onCepCalculate: (cep: string) => Promise<void>;
  calculating: boolean;
  initialCep?: string;
  showAutoFillIndicator?: boolean;
}

export function CepInput({ 
  onCepCalculate, 
  calculating, 
  initialCep, 
  showAutoFillIndicator = false 
}: CepInputProps) {
  const [cep, setCep] = useState('');
  const [isAutoFilled, setIsAutoFilled] = useState(false);

  const formatCep = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) {
      return cleaned;
    } else {
      return cleaned.slice(0, 5) + '-' + cleaned.slice(5, 8);
    }
  };

  // Auto-fill CEP when initialCep is provided
  useEffect(() => {
    if (initialCep && !cep) {
      const formattedCep = formatCep(initialCep);
      setCep(formattedCep);
      setIsAutoFilled(true);
    }
  }, [initialCep, cep]);

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCep = formatCep(e.target.value);
    setCep(formattedCep);
    
    // If user manually changes the CEP, it's no longer auto-filled
    if (isAutoFilled) {
      setIsAutoFilled(false);
    }
  };

  const handleCalculate = () => {
    if (cep.trim()) {
      onCepCalculate(cep);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="cep">CEP de Entrega</Label>
          {isAutoFilled && showAutoFillIndicator && (
            <Badge variant="secondary" className="text-xs">
              <MapPin className="h-3 w-3 mr-1" />
              Endereço padrão
            </Badge>
          )}
        </div>
        <Input
          id="cep"
          type="text"
          placeholder="00000-000"
          value={cep}
          onChange={handleCepChange}
          maxLength={9}
        />
      </div>
      
      <Button 
        onClick={handleCalculate}
        disabled={!cep.trim() || calculating}
        className="w-full"
      >
        {calculating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Calculando...
          </>
        ) : (
          'Calcular Frete'
        )}
      </Button>
    </div>
  );
}
