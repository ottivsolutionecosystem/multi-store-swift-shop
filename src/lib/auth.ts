
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';
import { SmartUserCache } from '@/lib/smartUserCache';

export async function getCurrentUser() {
  console.log('auth.ts - getting current user with smart cache');
  
  try {
    // Get current session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      console.log('auth.ts - no authenticated user');
      return null;
    }

    // Try cache first
    const cachedUser = await SmartUserCache.getUser(session.user.id);
    if (cachedUser) {
      console.log('auth.ts - returning cached user');
      return cachedUser;
    }

    // Cache and return session user
    await SmartUserCache.setUser(session.user);
    console.log('auth.ts - user cached and returned');
    return session.user;
  } catch (error) {
    console.error('auth.ts - error getting current user:', error);
    return null;
  }
}

export async function getCurrentProfile() {
  console.log('auth.ts - getting current profile with smart cache');
  
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log('auth.ts - no authenticated user for profile');
      return null;
    }

    // Try cache first
    const cachedProfile = await SmartUserCache.getProfile(user.id);
    if (cachedProfile) {
      console.log('auth.ts - returning cached profile');
      return cachedProfile;
    }

    // Fetch from database
    console.log('auth.ts - fetching profile from database');
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    // Update cache if we got fresh data
    if (profile) {
      await SmartUserCache.setProfile(user.id, profile);
    }

    return profile;
  } catch (error) {
    console.error('auth.ts - error getting current profile:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireRole(role: UserRole) {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== role) {
    throw new Error(`Role ${role} required`);
  }
  return profile;
}

export async function signIn(email: string, password: string) {
  console.log('auth.ts - signing in user with smart cache');
  
  // Clear cache before signing in
  await SmartUserCache.clearAll();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  
  // Cache the new user
  if (data.user) {
    await SmartUserCache.setUser(data.user);
  }
  
  return data;
}

export async function signUp(email: string, password: string, fullName?: string) {
  console.log('auth.ts - signing up user with smart cache');
  
  // Clear cache before signing up
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
  
  if (error) throw error;
  
  // Cache the new user
  if (data.user) {
    await SmartUserCache.setUser(data.user);
  }
  
  return data;
}

export async function signOut() {
  console.log('auth.ts - signing out user with smart cache');
  
  // Get current user to invalidate their cache
  const user = await getCurrentUser();
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  // Clear cache after successful sign out
  if (user) {
    await SmartUserCache.invalidateUser(user.id);
  } else {
    await SmartUserCache.clearAll();
  }
}
