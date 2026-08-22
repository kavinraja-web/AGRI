import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, CheckCircle2, ChevronLeft, TrendingDown, Loader2, Phone } from 'lucide-react';
import { getProductById } from '../services/productService';
import { useLanguage } from '../context/LanguageContext';
import { translateProductName } from '../utils/translateName';

export default function ProductDetails() {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      try {
        const res = await getProductById(id);
        setData(res);
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-forest-600 mb-3" />
        <p className="text-gray-500 font-medium">Loading produce details...</p>
      </div>
    );
  }

  const { product, farmer } = data || {};
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Product not found</h2>
        <Link to="/explore" className="btn-primary mt-4 inline-block">Back to Explore</Link>
      </div>
    );
  }

  // Price comparison
  const comparisonData = [
    { name: farmer?.name || "This Farm", price: product.price, current: true },
    { name: "Regional Market Avg", price: Math.round(product.price * 1.15), current: false },
    { name: "Retail Supermarket", price: Math.round(product.price * 1.35), current: false }
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
                <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2">
                  {translateProductName(product.name, lang)}
                </h1>
                <p className="text-forest-700 font-bold text-2xl">₹{product.price} <span className="text-lg text-gray-500 font-normal">/ {product.unit}</span></p>
              </div>
              {product.status === 'Available' ? (
                <span className="bg-forest-100 text-forest-700 px-3 py-1 rounded-full text-sm font-bold">
                  {product.quantity} {product.unit} {t('available').toLowerCase()}
                </span>
              ) : (
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                  {product.status === 'Low Stock' ? t('lowStock') : product.status}
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-8 text-lg leading-relaxed">{product.description || 'Fresh produce straight from local farms.'}</p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-earth-100 p-4 rounded-xl border border-earth-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Harvest Date</p>
                <p className="font-medium text-gray-900">{product.harvestDate || 'Fresh'}</p>
              </div>
              <div className="bg-earth-100 p-4 rounded-xl border border-earth-200">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Location</p>
                <p className="font-medium text-gray-900 flex items-center">
                  {product.location}
                </p>
              </div>
            </div>

            {product.lat && product.lng && (
              <div className="mb-8">
                <div className="w-full h-40 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 mb-3">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    scrolling="no"
                    marginHeight="0"
                    marginWidth="0"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${product.lng-0.01},${product.lat-0.01},${product.lng+0.01},${product.lat+0.01}&layer=mapnik&marker=${product.lat},${product.lng}`}
                    title="Farm Location"
                  ></iframe>
                </div>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${product.lat},${product.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-forest-600 hover:text-forest-700 bg-forest-50 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <MapPin className="h-4 w-4 mr-1.5" />
                  View Farm Location
                </a>
              </div>
            )}

            {/* Farmer Card */}
            {farmer && (
              <div className="border border-gray-200 rounded-2xl p-5 mb-8 flex items-center justify-between hover:border-forest-200 transition-colors bg-white shadow-sm">
                <div className="flex items-center gap-4">
                  <img src={farmer.image || 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=200&h=200'} alt={farmer.name} className="w-14 h-14 rounded-full object-cover border-2 border-forest-100" />
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
                  {t('viewDetails')}
                </Link>
              </div>
            )}

            <div className="flex gap-4 mt-auto">
              {farmer?.phone ? (
                <a 
                  href={`tel:${farmer.phone}`} 
                  className="btn-primary flex-grow text-lg shadow-forest-500/30 flex items-center justify-center gap-2"
                >
                  <Phone className="h-5 w-5" />
                  Call Farmer ({farmer.phone})
                </a>
              ) : (
                <button 
                  onClick={() => alert(`Connecting with farmer ${farmer?.name || ''}...`)}
                  className="btn-primary flex-grow text-lg shadow-forest-500/30"
                >
                  Contact Farmer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Price Comparison */}
      <div className="mt-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingDown className="text-forest-600 h-6 w-6" />
          <h2 className="text-2xl font-bold text-gray-900">Direct Farm Price vs Market</h2>
        </div>
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm max-w-2xl">
          <p className="text-gray-500 mb-6">You save significantly by buying directly from the farmer without middlemen.</p>
          <div className="space-y-4">
            {comparisonData.map((dataItem, idx) => (
              <div key={idx} className={`flex justify-between items-center p-4 rounded-xl ${dataItem.current ? 'bg-forest-50 border border-forest-100' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                    {dataItem.name.charAt(0)}
                  </div>
                  <span className={`font-medium ${dataItem.current ? 'text-forest-800' : 'text-gray-700'}`}>
                    {dataItem.name} {dataItem.current && "(Direct Farm Price)"}
                  </span>
                </div>
                <span className={`font-bold ${dataItem.current ? 'text-forest-700' : 'text-gray-900'}`}>
                  ₹{dataItem.price} <span className="text-sm font-normal text-gray-500">/{product.unit}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

