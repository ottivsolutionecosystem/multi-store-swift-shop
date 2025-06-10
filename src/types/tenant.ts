
import { Database } from '@/integrations/supabase/types';

export type Store = Database['public']['Tables']['stores']['Row'];

export interface TenantContext {
  store: Store | null;
  storeId: string | null;
  loading: boolean;
}
