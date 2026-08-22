import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, CheckCircle2, Star, Box, Users, ChevronLeft, Loader2, Phone } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getFarmerById } from '../services/farmerService';
import { getFarmerProducts } from '../services/productService';

export default function FarmerProfile() {
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [farmerProducts, setFarmerProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFarmerData() {
      setLoading(true);
      try {
        const [farmerData, productsData] = await Promise.all([
          getFarmerById(id),
          getFarmerProducts(id)
        ]);
        setFarmer(farmerData);
        setFarmerProducts(productsData);
      } catch (err) {
        console.error('Error fetching farmer profile:', err);
      } finally {
        setLoading(false);
      }
    }

    loadFarmerData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-forest-600 mb-3" />
        <p className="text-gray-500 font-medium">Loading farmer profile...</p>
      </div>
    );
  }

  if (!farmer) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Farmer not found</h2>
        <Link to="/explore" className="btn-primary mt-4 inline-block">Back to Explore</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/explore" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-forest-600 mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Explore
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm mb-12">
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
          <img 
            src={farmer.image || farmer.avatar_url || 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=200&h=200'} 
            alt={farmer.name} 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-earth-100 shadow-md"
          />
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                  {farmer.name || farmer.full_name}
                  {farmer.verified && <CheckCircle2 className="h-6 w-6 text-forest-500" />}
                </h1>
                <p className="text-gray-500 flex items-center mb-4">
                  <MapPin className="h-4 w-4 mr-1 text-forest-600" />
                  {farmer.location} • {farmer.distance || `${farmer.distanceValue || 15} km away`}
                </p>
                <p className="text-gray-700 bg-earth-100 px-3 py-1.5 rounded-lg inline-block text-sm font-medium">
                  {farmer.experience || 'Experienced Farmer'}
                </p>
              </div>

              {farmer.phone ? (
                <a 
                  href={`tel:${farmer.phone}`} 
                  className="btn-primary w-full md:w-auto shadow-forest-500/30 flex items-center justify-center gap-2"
                >
                  <Phone className="h-4 w-4" />
                  Call {farmer.phone}
                </a>
              ) : (
                <button 
                  onClick={() => alert(`Connecting with ${farmer.name}...`)} 
                  className="btn-primary w-full md:w-auto shadow-forest-500/30"
                >
                  Contact Farmer
                </button>
              )}
            </div>
            
            <p className="mt-6 text-gray-600 max-w-2xl leading-relaxed">
              {farmer.description || 'Dedicated to sustainable, organic farming.'}
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center text-forest-600 mb-2">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{farmer.rating || 5.0}</p>
            <p className="text-sm text-gray-500">Rating</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="flex items-center justify-center text-forest-600 mb-2">
              <Box className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{farmerProducts.length || farmer.productsCount || 0}</p>
            <p className="text-sm text-gray-500">Listings</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-forest-600 mb-2">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{farmer.peopleReached || 100}+</p>
            <p className="text-sm text-gray-500">People reached</p>
          </div>
        </div>
      </div>

      {/* Available Produce */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Produce from {farmer.name}</h2>
        {farmerProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {farmerProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center">
            <p className="text-gray-500">No products currently listed.</p>
          </div>
        )}
      </div>
    </div>
  );
}

