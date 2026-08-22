import { supabase, isSupabaseConfigured } from '../lib/supabase';

/**
 * Send OTP for Login / Sign Up
 */
export async function sendPhoneOtp({ phone, fullName, farmName, location }) {
  if (!isSupabaseConfigured() || !supabase) {
    // Offline / demo mode mock response
    return { message: 'Demo mode: Supabase keys not set. OTP sent locally.' };
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
    options: {
      data: {
        full_name: fullName || 'Farmer',
        phone,
        farm_name: farmName || '',
        location: location || 'Tamil Nadu',
        role: 'farmer',
        avatar_url: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=200&h=200',
        description: `Farmer from ${location || 'Tamil Nadu'} offering fresh produce.`
      }
    }
  });

  if (error) throw error;
  return data;
}

/**
 * Verify OTP to complete login
 */
export async function verifyPhoneOtp({ phone, token }) {
  if (!isSupabaseConfigured() || !supabase) {
    // Offline / demo mode mock login
    return {
      user: { id: 'mock-farmer-1', phone },
      session: {}
    };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms'
  });

  if (error) throw error;
  return data;
}

/**
 * Sign out current user
 */
export async function signOutFarmer() {
  if (!isSupabaseConfigured() || !supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/**
 * Fetch current user profile from profiles table
 */
export async function getFarmerProfile(userId) {
  if (!isSupabaseConfigured() || !supabase || !userId) {
    return {
      id: 1,
      full_name: 'Ravi Kumar',
      name: 'Ravi Kumar',
      email: 'ravi@example.com',
      farm_name: 'Ravi Organic Farm',
      location: 'Kanchipuram, Tamil Nadu',
      distance_km: 18,
      rating: 4.8,
      products_count: 15,
      people_reached: 124,
      verified: true,
      experience: 'Farming for 12+ years',
      description: 'We focus on organic vegetables and have been serving the local community for over a decade.',
      avatar_url: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=200&h=200',
      live_lat: 12.8341,
      live_lng: 79.7036,
      live_updated_at: new Date().toISOString()
    };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching farmer profile:', error);
    return null;
  }

  return {
    ...data,
    name: data.full_name,
    image: data.avatar_url,
    productsCount: data.products_count,
    peopleReached: data.people_reached
  };
}

/**
 * Update farmer profile
 */
export async function updateFarmerProfile(userId, profileData) {
  if (!isSupabaseConfigured() || !supabase) return profileData;

  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
