import { useParams, Link } from 'react-router-dom';
import { MapPin, User, CheckCircle2, ChevronLeft, ArrowRight, TrendingDown } from 'lucide-react';
import { products, farmers } from '../data/mockData';

export default function ProductDetails() {
  const { id } = useParams();
  const product = products.find(p => p.id === parseInt(id)) || products[0];
  const farmer = farmers.find(f => f.id === product.farmerId) || farmers[0];

  // Mock price comparison data
  const comparisonData = [
    { name: farmer.name, price: product.price, current: true },
    { name: "Suresh", price: product.price - 3, current: false },
    { name: "Lakshmi", price: product.price + 2, current: false }
  ].sort((a, b) => a.price - b.price);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/explore" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-forest-600 mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Explore
      </Link>

      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
        <div className="grid md:grid-cols-2 lg:gap-8">
          {/* Left: Image Gallery */}
          <div className="h-[400px] md:h-auto bg-gray-100 relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-gray-900 shadow-sm">
              {product.category}
            </div>
          </div>

          {/* Right: Details */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-forest-700 font-bold text-2xl">₹{product.price} <span className="text-lg text-gray-500 font-normal">/ {product.unit}</span></p>
              </div>
              {product.status === 'Available' ? (
                <span className="bg-forest-100 text-forest-700 px-3 py-1 rounded-full text-sm font-bold">
                  {product.quantity} {product.unit} available
                </span>
              ) : (
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                  {product.status}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-8 text-lg leading-relaxed">{product.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-earth-100 p-4 rounded-xl border border-earth-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Harvest Date</p>
                <p className="font-medium text-gray-900">{product.harvestDate}</p>
              </div>
              <div className="bg-earth-100 p-4 rounded-xl border border-earth-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                <p className="font-medium text-gray-900">{product.location}</p>
              </div>
            </div>

            {/* Farmer Card */}
            <div className="border border-gray-200 rounded-2xl p-5 mb-8 flex items-center justify-between hover:border-forest-200 transition-colors bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <img src={farmer.image} alt={farmer.name} className="w-14 h-14 rounded-full object-cover border-2 border-forest-100" />
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center gap-1.5">
                    {farmer.name}
                    {farmer.verified && <CheckCircle2 className="h-4 w-4 text-forest-500" />}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    {farmer.location}
                  </p>
                </div>
              </div>
              <Link to={`/farmer/${farmer.id}`} className="text-forest-600 font-medium text-sm hover:text-forest-700">
                View Profile
              </Link>
            </div>

            <div className="flex gap-4 mt-auto">
              <button className="btn-primary flex-grow text-lg shadow-forest-500/30">
                Contact Farmer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Price Comparison */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingDown className="text-forest-600 h-6 w-6" />
          <h2 className="text-2xl font-bold text-gray-900">Price Comparison</h2>
        </div>
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm max-w-2xl">
          <p className="text-gray-500 mb-6">Current prices for similar {product.name.toLowerCase()} in your area.</p>
          <div className="space-y-4">
            {comparisonData.map((data, idx) => (
              <div key={idx} className={`flex justify-between items-center p-4 rounded-xl ${data.current ? 'bg-forest-50 border border-forest-100' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {data.name.charAt(0)}
                  </div>
                  <span className={`font-medium ${data.current ? 'text-forest-800' : 'text-gray-700'}`}>
                    {data.name} {data.current && "(This Farmer)"}
                  </span>
                </div>
                <span className={`font-bold ${data.current ? 'text-forest-700' : 'text-gray-900'}`}>
                  ₹{data.price} <span className="text-sm font-normal text-gray-500">/{product.unit}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
