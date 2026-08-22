import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { farmers as mockFarmers } from '../data/mockData';

/**
 * Fetch all registered farmers
 */
export async function getFarmers() {
  if (!isSupabaseConfigured() || !supabase) {
    return mockFarmers;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'farmer')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return mockFarmers;
    }

    return data.map(f => ({
      id: f.id,
      name: f.full_name,
      location: f.location || 'Tamil Nadu',
      distance: `${f.distance_km || 15} km away`,
      distanceValue: f.distance_km || 15,
      rating: f.rating || 5.0,
      productsCount: f.products_count || 0,
      peopleReached: f.people_reached || 0,
      verified: f.verified ?? true,
      experience: f.experience || 'Experienced Farmer',
      description: f.description || '',
      image: f.avatar_url || 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=200&h=200'
    }));
  } catch (err) {
    console.error('getFarmers error:', err);
    return mockFarmers;
  }
}

/**
 * Fetch farmer by ID
 */
export async function getFarmerById(id) {
  if (!isSupabaseConfigured() || !supabase) {
    return mockFarmers.find(f => String(f.id) === String(id)) || mockFarmers[0];
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return mockFarmers.find(f => String(f.id) === String(id)) || mockFarmers[0];
    }

    return {
      id: data.id,
      name: data.full_name,
      phone: data.phone,
      email: data.email,
      farmName: data.farm_name,
      location: data.location || 'Tamil Nadu',
      distance: `${data.distance_km || 15} km away`,
      distanceValue: data.distance_km || 15,
      rating: data.rating || 5.0,
      productsCount: data.products_count || 0,
      peopleReached: data.people_reached || 0,
      verified: data.verified ?? true,
      experience: data.experience || 'Experienced Farmer',
      description: data.description || '',
      image: data.avatar_url || 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=200&h=200'
    };
  } catch (err) {
    console.error('getFarmerById error:', err);
    return mockFarmers[0];
  }
}
