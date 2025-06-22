
import { z } from 'zod';

// DTO para resposta padronizada de CEP
export const cepResponseSchema = z.object({
  cep: z.string(),
  state: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  street: z.string(),
  service: z.string(),
  location: z.object({
    type: z.string(),
    coordinates: z.object({
      longitude: z.string(),
      latitude: z.string(),
    }),
  }).optional(),
});

export type CepResponse = z.infer<typeof cepResponseSchema>;

// DTO específico da Brasil API
export const brasilApiCepResponseSchema = z.object({
  cep: z.string(),
  state: z.string(),
  city: z.string(),
  neighborhood: z.string(),
  street: z.string(),
  service: z.string(),
  location: z.object({
    type: z.string(),
    coordinates: z.object({
      longitude: z.string(),
      latitude: z.string(),
    }),
  }).optional(),
});

export type BrasilApiCepResponse = z.infer<typeof brasilApiCepResponseSchema>;

// Estados do hook de CEP
export interface CepLookupState {
  isLoading: boolean;
  error: string | null;
  data: CepResponse | null;
}
