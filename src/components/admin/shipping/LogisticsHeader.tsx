
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Truck } from 'lucide-react';

interface LogisticsHeaderProps {
  onCreateMethod: () => void;
}

export function LogisticsHeader({ onCreateMethod }: LogisticsHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/admin')}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar para Admin
      </Button>
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Truck className="h-8 w-8 text-blue-600" />
            Logística
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie os métodos de frete da sua loja
          </p>
        </div>
        
        <Button onClick={onCreateMethod}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Método de Frete
        </Button>
      </div>
    </div>
  );
}
