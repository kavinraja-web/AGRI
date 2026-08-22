import { Link, useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, Map, Users, ArrowRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getProducts } from '../services/productService';
import { categories } from '../data/mockData';

// Hero slideshow images
const heroImages = [
  {
    src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000',
    alt: 'Fresh local produce at market',
  },
  {
    src: '/assets/hero_farmer.png',
    alt: 'Tamil Nadu farmer',
  },
  {
    src: '/assets/hero_fruits.jpg',
    alt: 'Fresh local fruits',
  },
  {
    src: 'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?auto=format&fit=crop&q=80&w=1000',
    alt: 'Tamil Nadu farmland',
  },
];

export default function Landing() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Hero image slideshow
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const goToSlide = useCallback((idx) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(idx);
      setIsTransitioning(false);
    }, 400);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      goToSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [goToSlide]);

  // Dynamic "New Harvest" card from DB
  const [latestProduct, setLatestProduct] = useState(null);

  useEffect(() => {
    getProducts().then((data) => {
      if (data && data.length > 0) {
        // Pick the most recently added available product
        const available = data.filter(p => p.status === 'Available');
        setLatestProduct(available[0] || data[0]);
      }
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-earth-100 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

            {/* Left: Text */}
            <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                {t('heroTitle1')}<br />
                <span className="text-forest-600">{t('heroTitle2')}</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {t('heroSubtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link to="/explore" className="btn-primary flex items-center justify-center text-lg px-8 py-4">
                  {t('exploreProduce')}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                  {t('listYourProduce')}
                </Link>
              </div>

              {/* Search Bar */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto lg:mx-0">
                <p className="text-sm font-medium text-gray-500 mb-3 px-2">{t('whatAreYouLooking')}</p>
                <form onSubmit={handleSearch}>
                  <div className="relative flex items-center">
                    <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-12 text-gray-900 focus:ring-2 focus:ring-forest-500 outline-none"
                    />
                    <button type="submit" className="absolute right-2 bg-forest-600 text-white p-2 rounded-lg hover:bg-forest-700 transition-colors">
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
                <div className="flex flex-wrap gap-2 mt-4 px-2">
                  {categories.slice(0, 5).map(cat => (
                    <Link
                      key={cat}
                      to={`/explore?category=${cat}`}
                      className="text-xs font-medium bg-earth-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-earth-300 transition-colors"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Hero Image Slideshow */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[4/5]">
                {heroImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.src}
                    alt={img.alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                      idx === currentSlide
                        ? isTransitioning ? 'opacity-0' : 'opacity-100'
                        : 'opacity-0'
                    }`}
                  />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent pointer-events-none" />

                {/* Slide dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                  {heroImages.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`rounded-full transition-all duration-300 ${
                        idx === currentSlide
                          ? 'bg-white w-6 h-2'
                          : 'bg-white/50 w-2 h-2 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Dynamic "New Harvest" floating card */}
              {latestProduct && (
                <div
                  className="absolute -bottom-6 -left-6 md:bottom-8 md:-left-12 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 cursor-pointer hover:shadow-2xl transition-shadow"
                  style={{ animation: 'floatCard 3s ease-in-out infinite' }}
                  onClick={() => navigate(`/product/${latestProduct.id}`)}
                >
                  <img
                    src={latestProduct.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=100'}
                    alt={latestProduct.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-forest-100"
                  />
                  <div>
                    <p className="text-xs text-forest-600 font-bold uppercase tracking-wider">{t('newHarvest')}</p>
                    <p className="font-bold text-gray-900">{latestProduct.name}</p>
                    <p className="text-sm text-gray-500">
                      {latestProduct.farmerName} • ₹{latestProduct.price}/{latestProduct.unit}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Value Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('whyChoose')}</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('whyChooseSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, titleKey: 'transparentPrices', descKey: 'transparentPricesDesc' },
              { icon: Search,      titleKey: 'freshAvailable',    descKey: 'freshAvailableDesc' },
              { icon: Users,       titleKey: 'directConnection',  descKey: 'directConnectionDesc' },
              { icon: Map,         titleKey: 'localDiscovery',    descKey: 'localDiscoveryDesc' },
            ].map((feature, idx) => (
              <div key={idx} className="bg-earth-100 p-8 rounded-3xl hover:shadow-md transition-shadow">
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  <feature.icon className="h-7 w-7 text-forest-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{t(feature.titleKey)}</h3>
                <p className="text-gray-600 leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Natural Fertilizer Banner */}
      <section className="py-12 bg-earth-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-fresh-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <span className="inline-block bg-amber-400 text-forest-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                {t('featuredHub')}
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {t('fertilizerTitle')}
              </h2>
              <p className="text-forest-100 text-base sm:text-lg">{t('fertilizerDesc')}</p>
            </div>
            <div className="flex-shrink-0 w-full sm:w-auto">
              <Link
                to="/natural-fertilizers"
                className="block bg-amber-400 hover:bg-amber-300 text-forest-900 font-extrabold px-8 py-4 rounded-full text-center transition-all shadow-lg hover:scale-105"
              >
                {t('exploreFertilizers')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t('howItWorksTitle')}</h2>
            <p className="text-forest-100 text-lg">{t('howItWorksSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {[
              { step: '01', titleKey: 'step1Title', descKey: 'step1Desc' },
              { step: '02', titleKey: 'step2Title', descKey: 'step2Desc' },
              { step: '03', titleKey: 'step3Title', descKey: 'step3Desc' },
            ].map((item, idx) => (
              <div key={idx} className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-forest-800 rounded-full flex items-center justify-center mb-6 border-4 border-forest-900 shadow-xl">
                  <span className="text-3xl font-bold text-forest-300">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{t(item.titleKey)}</h3>
                <p className="text-forest-100 text-lg max-w-xs mx-auto">{t(item.descKey)}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/explore" className="inline-block bg-white text-forest-900 px-8 py-4 rounded-full font-bold hover:bg-forest-50 transition-colors">
              {t('startExploring')}
            </Link>
          </div>
        </div>
      </section>

      {/* Float animation keyframes */}
      <style>{`
        @keyframes floatCard {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
