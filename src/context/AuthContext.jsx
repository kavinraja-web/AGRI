import { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { getFarmerProfile, sendPhoneOtp, verifyPhoneOtp, signOutFarmer } from '../services/authService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [globalLocation, setGlobalLocation] = useState(null);
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

    // Try to get location automatically if permissions are already granted
    if (navigator.geolocation) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
          navigator.geolocation.getCurrentPosition(pos => {
            if (mounted) {
              setGlobalLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
            }
          });
        }
      });
    }

    return () => {
      mounted = false;
    };
  }, [isConfigured]);

  const requestLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setGlobalLocation(loc);
          resolve(loc);
        },
        (err) => reject(err)
      );
    });
  };

  const sendOtp = async (formData) => {
    return await sendPhoneOtp(formData);
  };

  const verifyOtp = async (credentials) => {
    const res = await verifyPhoneOtp(credentials);
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
      globalLocation,
      requestLocation,
      sendOtp,
      verifyOtp,
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
