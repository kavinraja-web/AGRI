-- =====================================================================
-- FarmConnect (AGRI) Supabase Database Schema
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- =====================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 1. PROFILES TABLE (Farmers and Consumers)
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'consumer', 'admin')),
    farm_name TEXT,
    location TEXT,
    distance_km NUMERIC DEFAULT 10,
    rating NUMERIC DEFAULT 5.0 CHECK (rating >= 0 AND rating <= 5.0),
    products_count INTEGER DEFAULT 0,
    people_reached INTEGER DEFAULT 0,
    verified BOOLEAN DEFAULT true,
    experience TEXT DEFAULT 'Farming for 5+ years',
    description TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 2. PRODUCTS / PRODUCE TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Vegetables', 'Fruits', 'Grains', 'Spices', 'Dairy', 'Other')),
    price NUMERIC NOT NULL CHECK (price >= 0),
    unit TEXT NOT NULL DEFAULT 'kg' CHECK (unit IN ('kg', 'grams', 'pieces', 'bunches', 'liters', 'quintal')),
    quantity NUMERIC NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    location TEXT,
    distance_text TEXT,
    harvest_date DATE DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Low Stock', 'Out of Stock', 'Draft')),
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 3. ORDERS TABLE
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    farmer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    buyer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    buyer_address TEXT,
    quantity NUMERIC NOT NULL,
    unit TEXT NOT NULL DEFAULT 'kg',
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================================
-- 4. AUTOMATIC TIMESTAMP UPDATE TRIGGER
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_products_updated ON public.products;
CREATE TRIGGER on_products_updated
    BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS on_orders_updated ON public.orders;
CREATE TRIGGER on_orders_updated
    BEFORE UPDATE ON public.orders
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================================
-- 5. AUTOMATIC PROFILE CREATION ON USER SIGNUP
-- =====================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        email,
        phone,
        role,
        farm_name,
        location,
        avatar_url,
        description
    ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', 'Farmer'),
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'farmer'),
        COALESCE(NEW.raw_user_meta_data->>'farm_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'location', 'Tamil Nadu'),
        COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=200&h=200'),
        COALESCE(NEW.raw_user_meta_data->>'description', 'Organic farmer dedicated to fresh, sustainable produce.')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone can view profiles; only owners can update their own profile
CREATE POLICY "Public profiles are viewable by everyone."
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can insert their own profile."
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile."
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Products: Anyone can view available products
CREATE POLICY "Products are viewable by everyone."
    ON public.products FOR SELECT
    USING (true);

-- Products: Authenticated farmers can insert their own products
CREATE POLICY "Farmers can create products."
    ON public.products FOR INSERT
    WITH CHECK (auth.uid() = farmer_id);

-- Products: Farmers can update their own products
CREATE POLICY "Farmers can update own products."
    ON public.products FOR UPDATE
    USING (auth.uid() = farmer_id);

-- Products: Farmers can delete their own products
CREATE POLICY "Farmers can delete own products."
    ON public.products FOR DELETE
    USING (auth.uid() = farmer_id);

-- Orders: Farmers can see orders for their products, Buyers can see their own orders
CREATE POLICY "Farmers can view orders for their produce"
    ON public.orders FOR SELECT
    USING (auth.uid() = farmer_id OR auth.uid() = buyer_id);

CREATE POLICY "Anyone can create an order"
    ON public.orders FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Farmers can update order status"
    ON public.orders FOR UPDATE
    USING (auth.uid() = farmer_id);

-- =====================================================================
-- 7. STORAGE BUCKET CONFIGURATION (for produce images)
-- Run this in SQL or create bucket 'produce-images' in Supabase Storage dashboard
-- =====================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('produce-images', 'produce-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access for Produce Images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'produce-images');

CREATE POLICY "Authenticated users can upload produce images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'produce-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their produce images"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'produce-images' AND auth.uid() = owner);

-- =====================================================================
-- 8. SEED DATA (OPTIONAL - FOR DEVELOPMENT & TESTING)
-- =====================================================================
-- Note: Replace mock farmer IDs with real Auth User IDs in production.
