
import { User, Session } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

export type UserRole = 'user' | 'admin';

export type Profile = Database['public']['Tables']['profiles']['Row'];

export interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
}
