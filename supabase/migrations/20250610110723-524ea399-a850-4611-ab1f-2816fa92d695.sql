
-- Remove a coluna promotion_display_format da tabela store_settings
ALTER TABLE public.store_settings DROP COLUMN IF EXISTS promotion_display_format;
