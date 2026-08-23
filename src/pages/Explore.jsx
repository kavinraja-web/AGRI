import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Loader2, MapPin } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import { useLanguage } from '../context/LanguageContext';
import { calculateDistanceInKm } from '../utils/distance';
import { useAuth } from '../context/AuthContext';

// Category list with translation keys — value stays English for DB filter
const CATEGORY_OPTIONS = [
  { value: 'Vegetables', labelKey: 'catVegetables' },
  { value: 'Fruits',     labelKey: 'catFruits' },
  { value: 'Grains',     labelKey: 'catGrains' },
  { value: 'Spices',     labelKey: 'catSpices' },
  { value: 'Dairy',      labelKey: 'catDairy' },
  { value: 'Other',      labelKey: 'catOther' },
];

const SORT_OPTIONS = [
  { value: 'Recommended',      labelKey: 'recommended' },
  { value: 'Price: Low to High', labelKey: 'priceLowHigh' },
  { value: 'Price: High to Low', labelKey: 'priceHighLow' },
  { value: 'Nearest First',    labelKey: 'nearestFirst' },
];

export default function Explore() {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { globalLocation, requestLocation } = useAuth();

  const [searchTerm, setSearchTerm]           = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [sortBy, setSortBy]                   = useState('Recommended');
  const [isFilterOpen, setIsFilterOpen]       = useState(false);
  const [products, setProducts]               = useState([]);
  const [loading, setLoading]                 = useState(true);
  
  const [gettingLocation, setGettingLocation] = useState(false);

  useEffect(() => {
    let active = true;
    async function loadData() {
      setLoading(true);
      try {
        let data = await getProducts({ category: selectedCategory, searchTerm, sortBy });
        
        // Calculate distances if user location is known
        if (globalLocation) {
          data = data.map(product => {
            if (product.lat && product.lng) {
              const dist = calculateDistanceInKm(globalLocation.lat, globalLocation.lng, product.lat, product.lng);
              return { 
                ...product, 
                distance: `📍 ${dist.toFixed(1)} km away`,
                distanceValue: dist 
              };
            }
            return {
               ...product,
               distance: '📍 Distance unavailable',
               distanceValue: 999999
            };
          });
          
          if (sortBy === 'Nearest First') {
            data.sort((a, b) => (a.distanceValue || 999999) - (b.distanceValue || 999999));
          }
        }
        
        if (active) setProducts(data);
      } catch (err) {
        console.error('Error fetching produce in Explore:', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    const timer = setTimeout(loadData, 200);
    return () => { active = false; clearTimeout(timer); };
  }, [selectedCategory, searchTerm, sortBy, globalLocation]);

  const handleGetLocation = async () => {
    setGettingLocation(true);
    try {
      await requestLocation();
      setSortBy('Nearest First');
    } catch (error) {
      alert("Unable to retrieve your location.");
    } finally {
      setGettingLocation(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('exploreTitle')}</h1>
          <p className="text-gray-600">{t('exploreSubtitle')}</p>
        </div>

        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2">
          <button 
            onClick={handleGetLocation}
            disabled={gettingLocation}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-medium hover:bg-emerald-100 transition-colors disabled:opacity-50"
          >
            {gettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
            {globalLocation ? 'Location Active' : 'Use My Location'}
          </button>
          
          <div className="relative flex-grow md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('searchProducePlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-forest-500 outline-none"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center justify-center p-2.5 border border-gray-200 rounded-xl bg-white text-gray-700"
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            {/* Filter heading */}
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg">
              <Filter className="h-5 w-5" />
              {t('filters')}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">{t('categories')}</h3>
              <div className="space-y-2">
                {/* All Produce */}
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'All'}
                    onChange={() => setSelectedCategory('All')}
                    className="text-forest-600 focus:ring-forest-500 w-4 h-4"
                  />
                  <span className="text-gray-600 group-hover:text-forest-600 transition-colors">
                    {t('allProduce')}
                  </span>
                </label>

                {/* Each category */}
                {CATEGORY_OPTIONS.map(({ value, labelKey }) => (
                  <label key={value} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === value}
                      onChange={() => setSelectedCategory(value)}
                      className="text-forest-600 focus:ring-forest-500 w-4 h-4"
                    />
                    <span className="text-gray-600 group-hover:text-forest-600 transition-colors">
                      {t(labelKey)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">{t('sortBy')}</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-forest-500 outline-none"
              >
                {SORT_OPTIONS.map(({ value, labelKey }) => (
                  <option key={value} value={value}>{t(labelKey)}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {loading ? (
            <div className="bg-white p-16 rounded-3xl border border-gray-100 text-center flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-forest-600 mb-3" />
              <p className="text-gray-600 font-medium">{t('fetchingProduce')}</p>
            </div>
          ) : products.length > 0 ? (
            <>
              <p className="text-sm text-gray-500 mb-4">
                {products.length} {products.length === 1 ? t('product') : t('products')} {t('available').toLowerCase()}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t('noProduceFound')}</h3>
              <p className="text-gray-500 mb-6">{t('noProduceDesc')}</p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
                className="btn-secondary"
              >
                {t('clearFilters')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
