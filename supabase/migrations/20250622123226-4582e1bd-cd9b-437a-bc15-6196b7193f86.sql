
-- Add Stripe Connect fields to store_settings table
ALTER TABLE public.store_settings 
ADD COLUMN stripe_user_id TEXT,
ADD COLUMN stripe_connected BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN stripe_connect_date TIMESTAMP WITH TIME ZONE;

-- Add index for better performance on stripe_user_id lookups
CREATE INDEX idx_store_settings_stripe_user_id ON public.store_settings(stripe_user_id);

-- Add comment for documentation
COMMENT ON COLUMN public.store_settings.stripe_user_id IS 'Stripe Connect account ID (acct_xxx) for this store';
COMMENT ON COLUMN public.store_settings.stripe_connected IS 'Whether this store has connected their Stripe account via OAuth';
COMMENT ON COLUMN public.store_settings.stripe_connect_date IS 'When the Stripe account was connected';
