
import { Database } from '@/integrations/supabase/types';

export type Store = Database['public']['Tables']['stores']['Row'] & {
  store_settings?: Database['public']['Tables']['store_settings']['Row'] | null;
};

export interface TenantContext {
  store: Store | null;
  storeId: string | null;
  loading: boolean;
}
