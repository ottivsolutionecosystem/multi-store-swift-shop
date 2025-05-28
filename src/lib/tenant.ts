
import { supabase } from '@/integrations/supabase/client';

export async function getStoreByDomain(domain: string) {
  const { data: store } = await supabase
    .from('stores')
    .select('*')
    .or(`domain.eq.${domain},custom_domain.eq.${domain}`)
    .single();

  return store;
}

export function getCurrentDomain(): string {
  if (typeof window === 'undefined') return 'demo.localhost:5173';
  return window.location.host;
}

export async function getCurrentStore() {
  const domain = getCurrentDomain();
  return await getStoreByDomain(domain);
}
