
-- Permitir que qualquer pessoa (incluindo usuários não autenticados) possa ler as configurações da loja
CREATE POLICY "Anyone can view store settings" 
ON public.store_settings 
FOR SELECT 
TO public 
USING (true);
