
import { z } from 'zod';
import { PaymentGatewayType, PaymentMethodType } from '@/interfaces/PaymentProvider';

export const paymentMethodSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(PaymentMethodType),
  enabled: z.boolean(),
  icon: z.string().optional(),
  description: z.string().optional(),
});

export const stripeConfigSchema = z.object({
  publicKey: z.string().min(1, 'Chave pública é obrigatória'),
  secretKey: z.string().min(1, 'Chave secreta é obrigatória'),
  webhookSecret: z.string().optional(),
});

export const mercadoPagoConfigSchema = z.object({
  publicKey: z.string().min(1, 'Chave pública é obrigatória'),
  accessToken: z.string().min(1, 'Access token é obrigatório'),
  webhookSecret: z.string().optional(),
});

export const paymentGatewayConfigSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(PaymentGatewayType),
  enabled: z.boolean(),
  testMode: z.boolean(),
  credentials: z.record(z.string()),
  supportedMethods: z.array(paymentMethodSchema),
  webhookUrl: z.string().optional(),
});

export const paymentSettingsSchema = z.object({
  gateways: z.array(paymentGatewayConfigSchema).default([]),
  defaultGateway: z.string().optional(),
  enabledMethods: z.array(z.string()).default([]),
});

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;
export type StripeConfig = z.infer<typeof stripeConfigSchema>;
export type MercadoPagoConfig = z.infer<typeof mercadoPagoConfigSchema>;
export type PaymentGatewayConfig = z.infer<typeof paymentGatewayConfigSchema>;
export type PaymentSettings = z.infer<typeof paymentSettingsSchema>;

export interface PaymentGatewayFormData {
  type: PaymentGatewayType;
  enabled: boolean;
  testMode: boolean;
  credentials: StripeConfig | MercadoPagoConfig;
  enabledMethods: string[];
}
