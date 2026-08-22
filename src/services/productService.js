import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { products as mockProducts, farmers as mockFarmers } from '../data/mockData';

/**
 * Format product object to match UI schema
 */
function formatProduct(item) {
  const farmer = item.profiles || {};
  return {
    id: item.id,
    name: item.name,
    category: item.category,
    price: Number(item.price),
    unit: item.unit || 'kg',
    quantity: Number(item.quantity),
    farmerId: item.farmer_id,
    farmerName: farmer.full_name || farmer.farm_name || 'Farmer',
    farmerImage: farmer.avatar_url,
    farmerVerified: farmer.verified ?? true,
    location: item.location || farmer.location || 'Tamil Nadu',
    distance: item.distance_text || `${farmer.distance_km || 15} km away`,
    distanceValue: farmer.distance_km || 15,
    harvestDate: item.harvest_date,
    status: item.status || 'Available',
    description: item.description,
    image: item.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600&h=400',
    createdAt: item.created_at
  };
}

/**
 * Fetch all products with optional filtering
 */
export async function getProducts({ category, searchTerm, sortBy } = {}) {
  if (!isSupabaseConfigured() || !supabase) {
    // Offline / Demo fallback
    let result = [...mockProducts];
    if (category && category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.farmerName.toLowerCase().includes(term) ||
        (p.location && p.location.toLowerCase().includes(term))
      );
    }
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Nearest First') {
      result.sort((a, b) => (a.distanceValue || 0) - (b.distanceValue || 0));
    }
    return result;
  }

  try {
    let query = supabase
      .from('products')
      .select(`
        *,
        profiles:farmer_id (
          id,
          full_name,
          farm_name,
          location,
          distance_km,
          verified,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`);
    }

    if (sortBy === 'Price: Low to High') {
      query = query.order('price', { ascending: true });
    } else if (sortBy === 'Price: High to Low') {
      query = query.order('price', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      return mockProducts;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(formatProduct);
  } catch (err) {
    console.error('getProducts exception:', err);
    return mockProducts;
  }
}

/**
 * Fetch a single product by ID with farmer info
 */
export async function getProductById(id) {
  if (!isSupabaseConfigured() || !supabase) {
    const p = mockProducts.find(item => String(item.id) === String(id)) || mockProducts[0];
    const f = mockFarmers.find(farmer => String(farmer.id) === String(p.farmerId)) || mockFarmers[0];
    return {
      product: p,
      farmer: f
    };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        profiles:farmer_id (
          id,
          full_name,
          phone,
          email,
          farm_name,
          location,
          distance_km,
          rating,
          products_count,
          people_reached,
          verified,
          experience,
          description,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) {
      console.warn('Product not found in Supabase, checking mock data:', error);
      const p = mockProducts.find(item => String(item.id) === String(id)) || mockProducts[0];
      const f = mockFarmers.find(farmer => String(farmer.id) === String(p.farmerId)) || mockFarmers[0];
      return { product: p, farmer: f };
    }

    const product = formatProduct(data);
    const farmer = data.profiles ? {
      id: data.profiles.id,
      name: data.profiles.full_name,
      phone: data.profiles.phone,
      email: data.profiles.email,
      farmName: data.profiles.farm_name,
      location: data.profiles.location,
      distance: `${data.profiles.distance_km || 15} km away`,
      distanceValue: data.profiles.distance_km || 15,
      rating: data.profiles.rating || 4.8,
      productsCount: data.profiles.products_count || 1,
      peopleReached: data.profiles.people_reached || 50,
      verified: data.profiles.verified ?? true,
      experience: data.profiles.experience || 'Experienced Farmer',
      description: data.profiles.description || 'Dedicated to sustainable produce.',
      image: data.profiles.avatar_url || 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=200&h=200'
    } : mockFarmers[0];

    return { product, farmer };
  } catch (err) {
    console.error('getProductById exception:', err);
    return {
      product: mockProducts[0],
      farmer: mockFarmers[0]
    };
  }
}

/**
 * Fetch products listed by a specific farmer
 */
export async function getFarmerProducts(farmerId) {
  if (!isSupabaseConfigured() || !supabase || !farmerId) {
    return mockProducts.filter(p => String(p.farmerId) === String(farmerId || 1));
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('farmer_id', farmerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching farmer products:', error);
      return mockProducts.filter(p => String(p.farmerId) === '1');
    }

    return data.map(item => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: Number(item.price),
      unit: item.unit,
      quantity: Number(item.quantity),
      farmerId: item.farmer_id,
      location: item.location,
      harvestDate: item.harvest_date,
      status: item.status,
      description: item.description,
      image: item.image_url || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600&h=400',
      createdAt: item.created_at
    }));
  } catch (err) {
    console.error('getFarmerProducts exception:', err);
    return mockProducts.filter(p => String(p.farmerId) === '1');
  }
}

/**
 * Create a new produce listing in Supabase
 */
export async function createProduct(productData) {
  if (!isSupabaseConfigured() || !supabase) {
    const newProduct = {
      id: Date.now(),
      ...productData,
      farmerId: 1,
      farmerName: 'Ravi Kumar',
      distance: '18 km away',
      status: productData.status || 'Available'
    };
    mockProducts.unshift(newProduct);
    return newProduct;
  }

  const { data, error } = await supabase
    .from('products')
    .insert([
      {
        farmer_id: productData.farmerId,
        name: productData.name,
        category: productData.category,
        price: Number(productData.price),
        unit: productData.unit || 'kg',
        quantity: Number(productData.quantity),
        location: productData.location,
        harvest_date: productData.harvestDate || new Date().toISOString().split('T')[0],
        status: productData.status || 'Available',
        description: productData.description,
        image_url: productData.imageUrl
      }
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a product by ID
 */
export async function deleteProduct(productId) {
  if (!isSupabaseConfigured() || !supabase) {
    return true;
  }

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) throw error;
  return true;
}
