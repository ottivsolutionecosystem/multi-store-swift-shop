
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Tag, MoreHorizontal, ChevronRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Database } from '@/integrations/supabase/types';

type Category = Database['public']['Tables']['categories']['Row'];

interface CategoryCardProps {
  category: Category;
  subcategories?: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
  onNavigate?: (categoryId: string) => void;
  parentCategory?: Category;
}

export function CategoryCard({ 
  category, 
  subcategories = [], 
  onEdit, 
  onDelete, 
  onNavigate,
  parentCategory 
}: CategoryCardProps) {
  const hasSubcategories = subcategories.length > 0;

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if clicking on dropdown or action buttons
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger]') || 
        (e.target as HTMLElement).closest('[data-action-button]')) {
      return;
    }
    
    if (hasSubcategories && onNavigate) {
      onNavigate(category.id);
    }
  };

  return (
    <Card 
      className={`group hover:shadow-md transition-all duration-200 hover:border-primary/20 ${
        hasSubcategories ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Imagem da categoria */}
          <div className="flex-shrink-0">
            {category.image_url ? (
              <img 
                src={category.image_url} 
                alt={category.name}
                className="w-16 h-16 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center border">
                <Tag className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Conteúdo da categoria */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  {parentCategory && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {parentCategory.name}
                    </Badge>
                  )}
                </div>
                {hasSubcategories && (
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    data-dropdown-trigger="true"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(category);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(category.id);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {category.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {category.description}
              </p>
            )}

            {hasSubcategories && (
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-gray-500 mr-2">
                  {subcategories.length} subcategoria{subcategories.length !== 1 ? 's' : ''}:
                </span>
                {subcategories.slice(0, 3).map((sub) => (
                  <Badge key={sub.id} variant="secondary" className="text-xs">
                    {sub.name}
                  </Badge>
                ))}
                {subcategories.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{subcategories.length - 3} mais
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
