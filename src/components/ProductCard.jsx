import { Link } from 'react-router-dom';
import { MapPin, User, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { translateProductName } from '../utils/translateName';
import { useUserLocation } from '../hooks/useUserLocation';
import { calculateDistanceInKm } from '../utils/distance';

export default function ProductCard({ product }) {
  const { lang, t } = useLanguage();
  const { userLocation } = useUserLocation();

  // Calculate distance if product has lat/lng and user location is available
  let displayDistance = product.distance;
  if (userLocation && product.lat && product.lng) {
    const dist = calculateDistanceInKm(userLocation.lat, userLocation.lng, product.lat, product.lng);
    displayDistance = `${dist.toFixed(1)} km away`;
  }

  return (
    <Link to={`/product/${product.id}`} className="group card flex flex-col overflow-hidden h-full">
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
          product.status === 'Available' ? 'text-forest-700' : 'text-orange-600'
        }`}>
          {product.status === 'Available' ? t('available') : product.status === 'Low Stock' ? t('lowStock') : product.status}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-forest-600 transition-colors">
            {translateProductName(product.name, lang)}
          </h3>
          <p className="font-bold text-forest-700 whitespace-nowrap ml-2">
            ₹{product.price} <span className="text-sm font-normal text-gray-500">/{product.unit}</span>
          </p>
        </div>

        <p className="text-sm text-gray-500 mb-4">{product.quantity} {product.unit} {t('available').toLowerCase()}</p>

        <div className="mt-auto space-y-2 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2 text-forest-500" />
            <span className="truncate">{product.farmerName}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 justify-between">
            <div className="flex items-center truncate">
              <MapPin className="h-4 w-4 mr-2 text-forest-500 flex-shrink-0" />
              <span className="truncate">{product.location}</span>
            </div>
            {displayDistance && (
              <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-md ml-2 whitespace-nowrap">
                {displayDistance}
              </span>
            )}
          </div>
        </div>

        <div className="mt-5 w-full bg-forest-50 text-forest-700 py-2.5 rounded-xl font-medium text-sm flex items-center justify-center group-hover:bg-forest-600 group-hover:text-white transition-colors">
          {t('viewDetails')}
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Link>
  );
}
