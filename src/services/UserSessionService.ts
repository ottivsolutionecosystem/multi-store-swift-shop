
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

export class UserSessionService {
  async getCurrentUser(): Promise<User | null> {
    console.log('UserSessionService - getting current user (simplified)');
    
    try {
      // Get session directly from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('UserSessionService - session error:', sessionError);
        return null;
      }

      if (!session?.user) {
        console.log('UserSessionService - no authenticated user in session');
        return null;
      }

      console.log('UserSessionService - user found:', session.user.id);
      return session.user;
    } catch (error) {
      console.error('UserSessionService - error in getCurrentUser:', error);
      return null;
    }
  }
}
