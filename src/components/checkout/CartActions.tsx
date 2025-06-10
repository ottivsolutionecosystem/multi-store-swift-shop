
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface CartActionsProps {
  allowEditing: boolean;
}

export function CartActions({ allowEditing }: CartActionsProps) {
  if (!allowEditing) return null;

  return (
    <div className="pt-4 border-t">
      <Link to="/">
        <Button variant="outline" className="w-full">
          Continuar Comprando
        </Button>
      </Link>
    </div>
  );
}
