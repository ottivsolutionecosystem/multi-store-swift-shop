
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, AuthRecoveryUtils } from '@/integrations/supabase/client';
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

  const ensureProfile = async (userId: string, userEmail?: string) => {
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
          email: userEmail || '',
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
      refreshToken: session?.refresh_token ? 'present' : 'missing',
      expiresAt: session?.expires_at
    });

    setSession(session);
    setUser(session?.user ?? null);

    if (session?.user) {
      // Validate session before proceeding
      const sessionValid = await AuthRecoveryUtils.validateCurrentSession();
      if (!sessionValid) {
        console.log('AuthContext - session validation failed, attempting recovery');
        const recovery = await AuthRecoveryUtils.forceTokenRefresh();
        if (!recovery) {
          console.error('AuthContext - session recovery failed');
          setSession(null);
          setUser(null);
          setProfile(null);
          setLoading(false);
          return;
        }
      }

      // Defer profile handling to avoid potential deadlocks
      setTimeout(async () => {
        try {
          const profileData = await ensureProfile(session.user.id, session.user.email);
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
    console.log('AuthContext - initializing with enhanced configuration');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    // Check for existing session with enhanced validation
    const initializeAuth = async () => {
      try {
        // First validate any existing session
        const sessionValid = await AuthRecoveryUtils.validateCurrentSession();
        console.log('AuthContext - initial session validation:', sessionValid);

        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('AuthContext - error getting session:', error);
          setLoading(false);
          return;
        }
        
        console.log('AuthContext - initial session check:', {
          hasSession: !!session,
          userId: session?.user?.id,
          email: session?.user?.email,
          valid: sessionValid
        });

        if (session && sessionValid) {
          await handleAuthStateChange('INITIAL_SESSION', session);
        } else if (session && !sessionValid) {
          console.log('AuthContext - session exists but invalid, attempting recovery');
          const recovery = await AuthRecoveryUtils.forceTokenRefresh();
          if (recovery) {
            // Get fresh session after recovery
            const { data: { session: freshSession } } = await supabase.auth.getSession();
            if (freshSession) {
              await handleAuthStateChange('RECOVERED_SESSION', freshSession);
            } else {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('AuthContext - initialization error:', error);
        setLoading(false);
      }
    };

    initializeAuth();

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
      profileStoreId: profile?.store_id,
      sessionExpiresAt: session?.expires_at
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
