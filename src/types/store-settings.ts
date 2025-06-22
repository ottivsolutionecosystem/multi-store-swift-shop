
import { z } from 'zod';
import { paymentSettingsSchema } from './payment-gateway';

export const addressSchema = z.object({
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório').max(2, 'Estado deve ter 2 caracteres'),
  zip_code: z.string().min(8, 'CEP deve ter 8 dígitos').max(9, 'CEP inválido'),
});

export const storeSettingsSchema = z.object({
  primary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida').default('#3b82f6'),
  secondary_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida').default('#6b7280'),
  price_color: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Deve ser uma cor hexadecimal válida').default('#16a34a'),
  logo_url: z.string().default(''),
  banner_url: z.string().default(''),
  store_description: z.string().default(''),
  show_category: z.boolean().default(true),
  show_description: z.boolean().default(true),
  show_stock_quantity: z.boolean().default(true),
  show_price: z.boolean().default(true),
  show_promotion_badge: z.boolean().default(true),
  // Endereço de origem para cálculo de frete
  origin_address: addressSchema.optional(),
  // Configurações de pagamento
  payment_settings: paymentSettingsSchema.optional(),
});

export type StoreSettingsFormData = z.infer<typeof storeSettingsSchema>;
export type AddressFormData = z.infer<typeof addressSchema>;
