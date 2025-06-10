
-- Renomear o campo payment_methods para digital_wallet_cards na tabela profiles
ALTER TABLE public.profiles 
RENAME COLUMN payment_methods TO digital_wallet_cards;

-- Atualizar o comentário da coluna para refletir o novo nome
COMMENT ON COLUMN public.profiles.digital_wallet_cards IS 'Cartões da carteira digital do usuário em formato JSON. Estrutura: [{"id": "uuid", "type": "credit_card|debit_card", "provider": "visa|mastercard|elo", "lastFourDigits": "1234", "cardholderName": "Nome", "expiryMonth": 12, "expiryYear": 2025, "isDefault": true, "isActive": true, "consentGiven": true, "consentDate": "ISO date", "dataRetentionUntil": "ISO date", "createdAt": "ISO date"}]';

-- Recriar o índice com o novo nome da coluna
DROP INDEX idx_profiles_payment_methods_gin;
CREATE INDEX idx_profiles_digital_wallet_cards_gin ON public.profiles USING gin (digital_wallet_cards);
