
-- Habilitar RLS nas tabelas que estão sem proteção
ALTER TABLE public.bundle_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promotion_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quantity_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_methods ENABLE ROW LEVEL SECURITY;

-- Criar função auxiliar para verificar se usuário é admin da loja
CREATE OR REPLACE FUNCTION public.is_store_admin(store_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND store_id = store_uuid
    AND role = 'admin'
  );
$$;

-- Políticas para shipping_methods (acesso público para leitura, admin para escrita)
CREATE POLICY "Public can view active shipping methods" 
  ON public.shipping_methods 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Store admins can manage shipping methods" 
  ON public.shipping_methods 
  FOR ALL 
  USING (public.is_store_admin(store_id))
  WITH CHECK (public.is_store_admin(store_id));

-- Políticas para product_bundles (acesso público para leitura, admin para escrita)
CREATE POLICY "Public can view active bundles" 
  ON public.product_bundles 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Store admins can manage bundles" 
  ON public.product_bundles 
  FOR ALL 
  USING (public.is_store_admin(store_id))
  WITH CHECK (public.is_store_admin(store_id));

-- Políticas para bundle_items (admin para escrita, público para leitura via join)
CREATE POLICY "Store admins can manage bundle items" 
  ON public.bundle_items 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.product_bundles pb
      WHERE pb.id = bundle_items.bundle_id 
      AND public.is_store_admin(pb.store_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.product_bundles pb
      WHERE pb.id = bundle_items.bundle_id 
      AND public.is_store_admin(pb.store_id)
    )
  );

CREATE POLICY "Public can view bundle items for active bundles" 
  ON public.bundle_items 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.product_bundles pb
      WHERE pb.id = bundle_items.bundle_id 
      AND pb.is_active = true
    )
  );

-- Políticas para quantity_discounts (admin para gestão, público para leitura)
CREATE POLICY "Public can view active quantity discounts" 
  ON public.quantity_discounts 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Store admins can manage quantity discounts" 
  ON public.quantity_discounts 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = quantity_discounts.product_id 
      AND public.is_store_admin(p.store_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.products p
      WHERE p.id = quantity_discounts.product_id 
      AND public.is_store_admin(p.store_id)
    )
  );

-- Políticas para promotion_coupons (admin para gestão)
CREATE POLICY "Store admins can manage promotion coupons" 
  ON public.promotion_coupons 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.promotions p
      WHERE p.id = promotion_coupons.promotion_id 
      AND public.is_store_admin(p.store_id)
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.promotions p
      WHERE p.id = promotion_coupons.promotion_id 
      AND public.is_store_admin(p.store_id)
    )
  );

-- Política para validação de cupons durante checkout (público pode verificar se válido)
CREATE POLICY "Public can validate active coupons" 
  ON public.promotion_coupons 
  FOR SELECT 
  USING (
    is_active = true 
    AND (usage_limit IS NULL OR usage_count < usage_limit)
  );

-- Políticas para promotion_usage (usuários autenticados)
CREATE POLICY "Users can view their own promotion usage" 
  ON public.promotion_usage 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create promotion usage" 
  ON public.promotion_usage 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Store admins can view all promotion usage" 
  ON public.promotion_usage 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.promotions p
      WHERE p.id = promotion_usage.promotion_id 
      AND public.is_store_admin(p.store_id)
    )
  );

-- Políticas para referrals (usuários autenticados)
CREATE POLICY "Users can view their own referrals" 
  ON public.referrals 
  FOR SELECT 
  USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

CREATE POLICY "Users can create referrals" 
  ON public.referrals 
  FOR INSERT 
  WITH CHECK (auth.uid() = referrer_user_id);

CREATE POLICY "Users can update their referrals" 
  ON public.referrals 
  FOR UPDATE 
  USING (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id)
  WITH CHECK (auth.uid() = referrer_user_id OR auth.uid() = referred_user_id);

-- Corrigir a view active_promotions removendo SECURITY DEFINER
DROP VIEW IF EXISTS public.active_promotions;

CREATE VIEW public.active_promotions AS
SELECT 
  p.id,
  p.store_id,
  p.name,
  p.description,
  p.discount_type,
  p.discount_value,
  p.start_date,
  p.end_date,
  p.is_active,
  p.priority,
  p.created_at,
  p.updated_at,
  prod.id as product_id,
  prod.name as product_name,
  prod.price as original_price,
  public.calculate_promotional_price(prod.price, p.discount_type, p.discount_value) as promotional_price
FROM public.promotions p
LEFT JOIN public.products prod ON (
  p.promotion_type = 'product' 
  AND (p.product_ids @> jsonb_build_array(prod.id::text) OR p.product_id = prod.id)
)
WHERE p.status = 'active'
  AND p.start_date <= now()
  AND p.end_date >= now()
  AND p.is_active = true;
