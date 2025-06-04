
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Calendar, Percent, Tag } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { format } from 'date-fns';

type Promotion = Database['public']['Tables']['promotions']['Row'];

interface PromotionListViewProps {
  promotions: Promotion[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PromotionListView({ promotions, onEdit, onDelete }: PromotionListViewProps) {
  const getStatusBadge = (promotion: Promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.start_date);
    const endDate = new Date(promotion.end_date);

    if (!promotion.is_active) {
      return <Badge variant="secondary">Inativa</Badge>;
    }

    if (startDate > now) {
      return <Badge variant="outline">Agendada</Badge>;
    }

    if (endDate < now) {
      return <Badge variant="destructive">Expirada</Badge>;
    }

    return <Badge variant="default">Ativa</Badge>;
  };

  const formatPromotionType = (type: string) => {
    const types = {
      'product': 'Produto',
      'category': 'Categoria', 
      'global': 'Global'
    };
    return types[type as keyof typeof types] || type;
  };

  const formatDiscountType = (type: string) => {
    return type === 'percentage' ? 'Percentual' : 'Valor Fixo';
  };

  if (promotions.length === 0) {
    return (
      <div className="text-center py-12">
        <Percent className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nenhuma promoção encontrada
        </h3>
        <p className="text-gray-600">
          Tente ajustar os filtros para encontrar as promoções desejadas
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {promotions.map((promotion) => (
        <Card key={promotion.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-1">
                    {promotion.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusBadge(promotion)}
                    <Badge variant="outline" className="text-xs">
                      {formatPromotionType(promotion.promotion_type || 'product')}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onEdit(promotion.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => onDelete(promotion.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Description */}
              {promotion.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {promotion.description}
                </p>
              )}

              {/* Discount Info */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">
                    Desconto: {promotion.discount_type === 'percentage' 
                      ? `${promotion.discount_value}%` 
                      : `R$ ${Number(promotion.discount_value).toFixed(2)}`
                    }
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  Tipo: {formatDiscountType(promotion.discount_type)}
                </div>
              </div>

              {/* Date Range */}
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Período</span>
                </div>
                <div className="text-xs text-blue-700">
                  {format(new Date(promotion.start_date), 'dd/MM/yyyy')} até{' '}
                  {format(new Date(promotion.end_date), 'dd/MM/yyyy')}
                </div>
              </div>

              {/* Priority */}
              {promotion.priority > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-orange-600" />
                  <span className="text-sm text-orange-700">
                    Prioridade: {promotion.priority}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
