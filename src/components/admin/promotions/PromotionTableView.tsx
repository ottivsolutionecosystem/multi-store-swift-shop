
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, ArrowUpDown } from 'lucide-react';
import { Database } from '@/integrations/supabase/types';
import { PromotionSort } from '@/types/promotion-management';
import { format } from 'date-fns';

type Promotion = Database['public']['Tables']['promotions']['Row'];

interface PromotionTableViewProps {
  promotions: Promotion[];
  sort: PromotionSort;
  onSortChange: (sort: PromotionSort) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function PromotionTableView({ 
  promotions, 
  sort, 
  onSortChange, 
  onEdit, 
  onDelete 
}: PromotionTableViewProps) {
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

  const handleSort = (field: PromotionSort['field']) => {
    const direction = sort.field === field && sort.direction === 'asc' ? 'desc' : 'asc';
    onSortChange({ field, direction });
  };

  const SortButton = ({ field, children }: { field: PromotionSort['field']; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-medium"
      onClick={() => handleSort(field)}
    >
      <span className="flex items-center gap-1">
        {children}
        <ArrowUpDown className="h-3 w-3" />
      </span>
    </Button>
  );

  if (promotions.length === 0) {
    return (
      <div className="text-center py-12">
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
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortButton field="name">Nome</SortButton>
            </TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>
              <SortButton field="discount_value">Desconto</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="start_date">Início</SortButton>
            </TableHead>
            <TableHead>
              <SortButton field="end_date">Fim</SortButton>
            </TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {promotions.map((promotion) => (
            <TableRow key={promotion.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{promotion.name}</div>
                  {promotion.description && (
                    <div className="text-sm text-gray-500 line-clamp-1 max-w-48">
                      {promotion.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(promotion)}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {formatPromotionType(promotion.promotion_type || 'product')}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {promotion.discount_type === 'percentage' 
                      ? `${promotion.discount_value}%` 
                      : `R$ ${Number(promotion.discount_value).toFixed(2)}`
                    }
                  </div>
                  <div className="text-xs text-gray-500">
                    {promotion.discount_type === 'percentage' ? 'Percentual' : 'Valor Fixo'}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {format(new Date(promotion.start_date), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell className="text-sm">
                {format(new Date(promotion.end_date), 'dd/MM/yyyy')}
              </TableCell>
              <TableCell>
                {promotion.priority > 0 && (
                  <Badge variant="secondary">{promotion.priority}</Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
