
import { supabase } from '@/integrations/supabase/client';
import { UserRole } from '@/types/auth';
import { UserCache } from '@/lib/userCache';

export async function getCurrentUser() {
  // Try cache first for better performance
  const cached = UserCache.get();
  if (cached && cached.user) {
    console.log('auth.ts - returning cached user');
    return cached.user;
  }

  console.log('auth.ts - fetching user from Supabase');
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user || null;
}

export async function getCurrentProfile() {
  // Try cache first
  const cached = UserCache.get();
  if (cached && cached.profile) {
    console.log('auth.ts - returning cached profile');
    return cached.profile;
  }

  console.log('auth.ts - fetching profile from Supabase');
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  // Update cache if we got fresh data
  if (profile) {
    UserCache.set(user, profile);
  }

  return profile;
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
  console.log('auth.ts - signing in user');
  // Clear cache before signing in
  UserCache.clear();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string, fullName?: string) {
  console.log('auth.ts - signing up user');
  // Clear cache before signing up
  UserCache.clear();
  
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
  return data;
}

export async function signOut() {
  console.log('auth.ts - signing out user');
  // Clear cache before signing out
  UserCache.clear();
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
