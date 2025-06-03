
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Home } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoryBreadcrumbProps {
  currentCategory?: Category;
  onNavigateToRoot: () => void;
}

export function CategoryBreadcrumb({ currentCategory, onNavigateToRoot }: CategoryBreadcrumbProps) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={onNavigateToRoot}
        className="h-auto p-1 hover:text-primary"
      >
        <Home className="h-4 w-4 mr-1" />
        Categorias
      </Button>
      
      {currentCategory && (
        <>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">{currentCategory.name}</span>
        </>
      )}
    </div>
  );
}
