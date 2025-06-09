
-- Criar política de acesso público para visualização de promoções ativas
CREATE POLICY "Public can view active promotions" 
  ON public.promotions 
  FOR SELECT 
  USING (
    status = 'active' 
    AND start_date <= now() 
    AND end_date >= now()
    AND is_active = true
  );
