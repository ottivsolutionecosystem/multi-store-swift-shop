
-- Adicionar campo payment_methods na tabela profiles para armazenar métodos de pagamento
ALTER TABLE public.profiles 
ADD COLUMN payment_methods jsonb DEFAULT '[]'::jsonb;

-- Comentário explicativo sobre o campo
COMMENT ON COLUMN public.profiles.payment_methods IS 'Métodos de pagamento do usuário em formato JSON. Estrutura: [{"id": "uuid", "type": "credit_card|debit_card|pix", "provider": "visa|mastercard|elo|pix", "lastFourDigits": "1234", "cardholderName": "Nome", "expiryMonth": 12, "expiryYear": 2025, "isDefault": true, "isActive": true, "consentGiven": true, "consentDate": "ISO date", "dataRetentionUntil": "ISO date", "createdAt": "ISO date"}]';

-- Criar índice para otimizar consultas nos métodos de pagamento
CREATE INDEX idx_profiles_payment_methods_gin ON public.profiles USING gin (payment_methods);
