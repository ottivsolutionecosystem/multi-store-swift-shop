
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthState, Profile } from '@/types/auth';

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  profile: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const ensureProfile = async (userId: string) => {
    console.log('AuthContext - ensuring profile for user:', userId);
    try {
      // Check if profile exists
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('AuthContext - error checking profile:', profileError);
        return null;
      }

      if (existingProfile) {
        console.log('AuthContext - profile exists:', existingProfile);
        return existingProfile;
      }

      // Profile doesn't exist, create one
      console.log('AuthContext - creating missing profile for user:', userId);
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([{
          id: userId,
          email: user?.email || '',
          role: 'admin', // Default to admin for now
          store_id: 'bb9e7e18-b166-4fb7-8f73-e431400dfd87' // Demo store ID
        }])
        .select()
        .single();

      if (createError) {
        console.error('AuthContext - error creating profile:', createError);
        return null;
      }

      console.log('AuthContext - profile created successfully:', newProfile);
      return newProfile;
    } catch (error) {
      console.error('AuthContext - error in ensureProfile:', error);
      return null;
    }
  };

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    console.log('AuthContext - auth state changed:', event, {
      userId: session?.user?.id,
      email: session?.user?.email,
      accessToken: session?.access_token ? 'present' : 'missing',
      refreshToken: session?.refresh_token ? 'present' : 'missing'
    });

    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      // Defer profile handling to avoid potential deadlocks
      setTimeout(async () => {
        try {
          const profileData = await ensureProfile(session.user.id);
          setProfile(profileData);
          console.log('AuthContext - profile set:', profileData);
        } catch (error) {
          console.error('AuthContext - error handling profile:', error);
          setProfile(null);
        }
      }, 100);
    } else {
      setProfile(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log('AuthContext - initializing');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('AuthContext - error getting session:', error);
        setLoading(false);
        return;
      }
      
      console.log('AuthContext - initial session check:', {
        hasSession: !!session,
        userId: session?.user?.id,
        email: session?.user?.email
      });

      if (session) {
        handleAuthStateChange('SIGNED_IN', session);
      } else {
        setLoading(false);
      }
    });

    return () => {
      console.log('AuthContext - cleanup');
      subscription.unsubscribe();
    };
  }, []);

  // Debug effect to monitor auth state
  useEffect(() => {
    console.log('AuthContext - state update:', {
      loading,
      hasUser: !!user,
      hasSession: !!session,
      hasProfile: !!profile,
      userId: user?.id,
      profileRole: profile?.role,
      profileStoreId: profile?.store_id
    });
  }, [loading, user, session, profile]);

  const value: AuthState = {
    user,
    session,
    profile,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
