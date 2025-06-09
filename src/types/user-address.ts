
import { z } from 'zod';

export const userAddressSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome do endereço é obrigatório'),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório').max(2, 'Estado deve ter 2 caracteres'),
  zip_code: z.string().min(8, 'CEP deve ter 8 dígitos').max(9, 'CEP inválido'),
  is_default: z.boolean().default(false),
});

export type UserAddressFormData = z.infer<typeof userAddressSchema>;

export interface UserAddress extends UserAddressFormData {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}
