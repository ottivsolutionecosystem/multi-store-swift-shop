
import { z } from 'zod';

export const storeSettingsSchema = z.object({
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida').default('#3b82f6'),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida').default('#6b7280'),
  logo_url: z.string().optional(),
  banner_url: z.string().optional(),
  store_description: z.string().optional(),
  show_category: z.boolean().default(true),
  show_description: z.boolean().default(true),
  show_stock_quantity: z.boolean().default(true),
  show_price: z.boolean().default(true),
  show_promotion_badge: z.boolean().default(true),
  promotion_display_format: z.enum(['percentage', 'comparison']).default('percentage'),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
