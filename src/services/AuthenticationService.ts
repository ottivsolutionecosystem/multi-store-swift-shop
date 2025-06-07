
import { supabase } from '@/integrations/supabase/client';
import { SmartUserCache } from '@/lib/smartUserCache';

export class AuthenticationService {
  async signIn(email: string, password: string) {
    console.log('AuthenticationService - signing in user and clearing cache');
    
    // Clear all cache before sign in
    await SmartUserCache.clearAll();
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      console.error('AuthenticationService - sign in error:', error);
      throw error;
    }
    
    // Cache the new user
    if (data.user) {
      await SmartUserCache.setUser(data.user);
    }
    
    console.log('AuthenticationService - user signed in successfully');
    return data;
  }

  async signUp(email: string, password: string, fullName?: string) {
    console.log('AuthenticationService - signing up user and clearing cache');
    
    // Clear all cache before sign up
    await SmartUserCache.clearAll();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    
    if (error) {
      console.error('AuthenticationService - sign up error:', error);
      throw error;
    }
    
    // Cache the new user
    if (data.user) {
      await SmartUserCache.setUser(data.user);
    }
    
    console.log('AuthenticationService - user signed up successfully');
    return data;
  }

  async signOut() {
    console.log('AuthenticationService - signing out user and clearing cache');
    
    // Get current user to invalidate their specific cache
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;
    
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('AuthenticationService - sign out error:', error);
      throw error;
    }
    
    // Clear cache after successful sign out
    if (user) {
      await SmartUserCache.invalidateUser(user.id);
    } else {
      await SmartUserCache.clearAll();
    }
    
    console.log('AuthenticationService - user signed out successfully');
  }
}
