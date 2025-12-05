
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string, captchaToken?: string) => Promise<{ error: any }>;
  register: (data: { name: string; email: string; password: string; company?: string; epaLicense?: string }, captchaToken?: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (profileData) {
        const profile = {
          id: profileData.id,
          email: profileData.email || '',
          full_name: profileData.full_name || '',
          role: (profileData.role as 'admin' | 'user') || 'user'
        };
        console.log('Profile fetched successfully:', profile);
        return profile;
      }
      return null;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setIsLoading(false);
          }
          return;
        }

        console.log('Initial session:', initialSession?.user?.id || 'no session');
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          
          if (initialSession?.user) {
            const profileData = await fetchProfile(initialSession.user.id);
            if (mounted) {
              setProfile(profileData);
            }
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id || 'no session');
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch profile without blocking the auth state
          setTimeout(async () => {
            if (mounted) {
              const profileData = await fetchProfile(session.user.id);
              if (mounted) {
                setProfile(profileData);
              }
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        // Set loading to false immediately after handling auth state
        setIsLoading(false);
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string, captchaToken?: string) => {
    console.log('AuthContext login attempt for:', email);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
        options: {
          captchaToken
        }
      });
      
      console.log('Login response error:', error);
      return { error };
    } catch (error) {
      console.error('Login catch error:', error);
      return { error };
    }
  };

  const register = async (data: { name: string; email: string; password: string; company?: string; epaLicense?: string }, captchaToken?: string) => {
    try {
      console.log('Starting registration for:', data.email);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.toLowerCase().trim(),
        password: data.password,
        options: {
          captchaToken,
          data: {
            full_name: data.name,
            company: data.company,
            epa_license: data.epaLicense,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        console.error('Registration error details:', error);
        
        // Provide specific error messages based on error type
        let errorMessage = error.message;
        
        if (error.message.includes('Password should be at least')) {
          errorMessage = 'Password must be at least 6 characters long.';
        } else if (error.message.includes('User already registered')) {
          errorMessage = 'This email is already registered. Please sign in instead.';
        } else if (error.message.includes('Invalid email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('Signup is disabled')) {
          errorMessage = 'Registration is currently disabled. Please contact support.';
        }
        
        return { 
          error: {
            message: errorMessage,
            status: error.status,
            statusText: error.status ? `${error.status}` : 'Registration failed'
          }
        };
      }
      
      if (authData.user) {
        console.log('Registration successful, user created:', authData.user.id);
        console.log('User email confirmed:', !!authData.user.email_confirmed_at);
        
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Try to verify the profile was created
        try {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();
          
          if (profileError) {
            console.error('Profile creation error:', profileError);
          } else {
            console.log('Profile created successfully:', profileData);
          }
        } catch (profileCheckError) {
          console.error('Error checking profile:', profileCheckError);
        }
      }
      
      return { error: null };
    } catch (err: any) {
      console.error('Unexpected registration error:', err);
      return { 
        error: {
          message: err.message || 'An unexpected error occurred during registration',
          details: err
        }
      };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = profile?.role === 'admin';

  const value = {
    user,
    session,
    profile,
    isAdmin,
    isLoading,
    signOut,
    login,
    register,
    logout,
  };

  console.log('AuthProvider render:', { 
    user: !!user, 
    profile: !!profile, 
    isAdmin, 
    isLoading,
    profileRole: profile?.role 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
