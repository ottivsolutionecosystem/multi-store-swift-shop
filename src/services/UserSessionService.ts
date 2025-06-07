
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { SmartUserCache } from '@/lib/smartUserCache';

export class UserSessionService {
  async getCurrentUser(): Promise<User | null> {
    console.log('UserSessionService - getting current user with smart cache');
    
    try {
      // First, get session to check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('UserSessionService - session error:', sessionError);
        return null;
      }

      if (!session?.user) {
        console.log('UserSessionService - no authenticated user in session');
        return null;
      }

      // Try to get from cache first
      const cachedUser = await SmartUserCache.getUser(session.user.id);
      if (cachedUser) {
        console.log('UserSessionService - returning cached user');
        return cachedUser;
      }

      // If not in cache, use the session user and cache it
      const user = session.user;
      await SmartUserCache.setUser(user);
      
      console.log('UserSessionService - user fetched and cached');
      return user;
    } catch (error) {
      console.error('UserSessionService - error in getCurrentUser:', error);
      throw error;
    }
  }
}
