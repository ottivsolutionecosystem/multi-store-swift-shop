
import { z } from 'zod';

export const storeSettingsSchema = z.object({
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida'),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida'),
  logo_url: z.string().optional(),
  banner_url: z.string().optional(),
  store_description: z.string().optional(),
  show_category: z.boolean(),
  show_description: z.boolean(),
  show_stock_quantity: z.boolean(),
  show_price: z.boolean(),
  show_promotion_badge: z.boolean(),
  promotion_display_format: z.enum(['percentage', 'comparison']),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
