import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getFarmerProfile, signUpFarmer, signInFarmer, signOutFarmer } from '../services/authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  // Load user session on mount
  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      if (!isConfigured || !supabase) {
        // Provide mock logged-in state in demo mode
        const mockProfile = await getFarmerProfile(1);
        if (mounted) {
          setFarmerProfile(mockProfile);
          setLoading(false);
        }
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          setUser(session.user);
          const profile = await getFarmerProfile(session.user.id);
          if (mounted) setFarmerProfile(profile);
        }
      } catch (err) {
        console.error('Error loading Supabase auth session:', err);
      } finally {
        if (mounted) setLoading(false);
      }

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          const profile = await getFarmerProfile(session.user.id);
          setFarmerProfile(profile);
        } else {
          setUser(null);
          setFarmerProfile(null);
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }

    loadSession();

    return () => {
      mounted = false;
    };
  }, [isConfigured]);

  const register = async (formData) => {
    const res = await signUpFarmer(formData);
    if (res?.user && (!isConfigured || !supabase)) {
      setUser(res.user);
      setFarmerProfile({
        id: res.user.id,
        full_name: formData.fullName,
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        farm_name: formData.farmName,
        location: formData.location,
        avatar_url: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=200&h=200'
      });
    }
    return res;
  };

  const login = async (credentials) => {
    const res = await signInFarmer(credentials);
    if (res?.user && (!isConfigured || !supabase)) {
      setUser(res.user);
      const mockProfile = await getFarmerProfile(1);
      setFarmerProfile(mockProfile);
    }
    return res;
  };

  const logout = async () => {
    await signOutFarmer();
    setUser(null);
    setFarmerProfile(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      farmerProfile,
      loading,
      isConfigured,
      register,
      login,
      logout,
      setFarmerProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
