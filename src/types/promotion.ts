
import { z } from 'zod';

// Schema com validação condicional mais inteligente
export const promotionSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  promotion_type: z.enum(['product', 'category', 'global']),
  discount_type: z.enum(['percentage', 'fixed_amount']),
  discount_value: z.number().min(0.01, 'Valor deve ser maior que 0'),
  start_date: z.date({ required_error: 'Data de início é obrigatória' }),
  end_date: z.date({ required_error: 'Data de fim é obrigatória' }),
  product_ids: z.array(z.string()).optional(),
  category_ids: z.array(z.string()).optional(),
  minimum_purchase_amount: z.number().min(0, 'Valor deve ser positivo').optional(),
  usage_limit: z.number().min(1, 'Limite deve ser maior que 0').optional().nullable(),
  usage_limit_per_customer: z.number().min(1, 'Limite deve ser maior que 0').optional(),
  priority: z.number().min(0, 'Prioridade deve ser positiva').default(0),
  status: z.enum(['draft', 'scheduled', 'active', 'expired', 'inactive']).default('draft'),
}).refine((data) => {
  if (data.discount_type === 'percentage' && data.discount_value > 100) {
    return false;
  }
  return true;
}, {
  message: 'Desconto em porcentagem não pode ser maior que 100%',
  path: ['discount_value'],
}).refine((data) => {
  return data.end_date > data.start_date;
}, {
  message: 'Data de fim deve ser posterior à data de início',
  path: ['end_date'],
}).refine((data) => {
  // Só valida se o tipo for 'product' E se não está em estado inicial (arrays vazios são aceitos no início)
  if (data.promotion_type === 'product') {
    // Se product_ids existe e é um array com pelo menos um elemento, está OK
    // Se não existe ou é um array vazio, falha apenas se outros campos já foram preenchidos
    const hasProductIds = data.product_ids && data.product_ids.length > 0;
    const formSeemsFilled = data.name && data.name.length > 0;
    
    if (formSeemsFilled && !hasProductIds) {
      return false;
    }
  }
  return true;
}, {
  message: 'Pelo menos um produto deve ser selecionado',
  path: ['product_ids'],
}).refine((data) => {
  // Só valida se o tipo for 'category' E se não está em estado inicial
  if (data.promotion_type === 'category') {
    const hasCategoryIds = data.category_ids && data.category_ids.length > 0;
    const formSeemsFilled = data.name && data.name.length > 0;
    
    if (formSeemsFilled && !hasCategoryIds) {
      return false;
    }
  }
  return true;
}, {
  message: 'Pelo menos uma categoria deve ser selecionada',
  path: ['category_ids'],
});

export type PromotionFormData = z.infer<typeof promotionSchema>;

export interface PromotionWithPriority {
  id: string;
  name: string;
  discount_type: string;
  discount_value: number;
  promotional_price: number;
  promotion_type: 'global' | 'category' | 'product';
  priority: number;
  compare_at_price?: number | null;
}

export type PromotionStatus = 'draft' | 'scheduled' | 'active' | 'expired' | 'inactive';
