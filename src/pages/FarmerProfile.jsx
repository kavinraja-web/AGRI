import { useParams, Link } from 'react-router-dom';
import { MapPin, CheckCircle2, Star, Box, Users, ChevronLeft } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { farmers, products } from '../data/mockData';

export default function FarmerProfile() {
  const { id } = useParams();
  const farmer = farmers.find(f => f.id === parseInt(id)) || farmers[0];
  const farmerProducts = products.filter(p => p.farmerId === farmer.id);

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
            src={farmer.image} 
            alt={farmer.name} 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-earth-100 shadow-md"
          />
          <div className="flex-grow">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-2">
                  {farmer.name}
                  {farmer.verified && <CheckCircle2 className="h-6 w-6 text-forest-500" />}
                </h1>
                <p className="text-gray-500 flex items-center mb-4">
                  <MapPin className="h-4 w-4 mr-1 text-forest-600" />
                  {farmer.location} • {farmer.distance}
                </p>
                <p className="text-gray-700 bg-earth-100 px-3 py-1.5 rounded-lg inline-block text-sm font-medium">
                  {farmer.experience}
                </p>
              </div>
              <button className="btn-primary w-full md:w-auto shadow-forest-500/30">
                Contact Farmer
              </button>
            </div>
            
            <p className="mt-6 text-gray-600 max-w-2xl leading-relaxed">
              {farmer.description}
            </p>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-10 pt-8 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center text-forest-600 mb-2">
              <Star className="h-5 w-5 fill-current" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{farmer.rating}</p>
            <p className="text-sm text-gray-500">Rating</p>
          </div>
          <div className="text-center border-x border-gray-100">
            <div className="flex items-center justify-center text-forest-600 mb-2">
              <Box className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{farmer.productsCount}</p>
            <p className="text-sm text-gray-500">Products</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-forest-600 mb-2">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{farmer.peopleReached}+</p>
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
            <p className="text-gray-500">No products currently available.</p>
          </div>
        )}
      </div>
    </div>
  );
}
