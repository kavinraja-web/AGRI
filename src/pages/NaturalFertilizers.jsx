import { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Phone, 
  Truck, 
  ShieldCheck, 
  PlusCircle, 
  CheckCircle2, 
  Leaf, 
  Sparkles,
  X,
  Heart,
  Grid,
  IndianRupee,
  Headphones,
  Sprout,
  ShoppingBag
} from 'lucide-react';
import { initialLivestockFarms } from '../data/fertilizerFarmsData';

export default function NaturalFertilizers() {
  // Favorites / Heart state
  const [favorites, setFavorites] = useState({});

  // Farms list state
  const [farms, setFarms] = useState(() => {
    const saved = localStorage.getItem('local_fertilizer_farms');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialLivestockFarms; }
    }
    return initialLivestockFarms;
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modals state
  const [buyModalFarm, setBuyModalFarm] = useState(null);
  const [buyQuantity, setBuyQuantity] = useState(5);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    phone: '',
    farmType: 'Hen / Poultry Farm',
    typeBadge: 'hen',
    fertilizerType: '',
    quantity: '',
    pricePerUnit: '',
    location: '',
    distance: '',
    deliveryMode: 'Pickup & Farm Delivery',
    description: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const saveFarmsToStorage = (updatedFarms) => {
    setFarms(updatedFarms);
    localStorage.setItem('local_fertilizer_farms', JSON.stringify(updatedFarms));
  };

  // Filtered Cards
  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          farm.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          farm.fertilizerType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || farm.typeBadge === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Register Farm Form submit
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Farm Name required *';
    if (!formData.ownerName.trim()) errors.ownerName = 'Owner Name required *';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ''))) {
      errors.phone = 'Valid 10-digit Phone required *';
    }
    if (!formData.fertilizerType.trim()) errors.fertilizerType = 'Fertilizer Type required *';
    if (!formData.quantity || Number(formData.quantity) <= 0) errors.quantity = 'Quantity required *';
    if (!formData.pricePerUnit || Number(formData.pricePerUnit) <= 0) errors.pricePerUnit = 'Price required *';
    if (!formData.location.trim()) errors.location = 'Location required *';
    if (!formData.distance || Number(formData.distance) < 0) errors.distance = 'Distance required *';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newFarm = {
      id: `farm-${Date.now()}`,
      name: formData.name,
      ownerName: formData.ownerName,
      phone: formData.phone,
      farmType: formData.farmType,
      typeBadge: formData.typeBadge,
      fertilizerType: formData.fertilizerType,
      quantity: Number(formData.quantity),
      unit: 'Tons',
      pricePerUnit: Number(formData.pricePerUnit),
      priceUnit: 'Ton',
      location: formData.location,
      distance: Number(formData.distance),
      deliveryMode: formData.deliveryMode,
      verified: true,
      description: formData.description || 'Natural organic manure mixed with farm sand & soil.',
      tags: ['Pure & Organic', 'Soil Enricher', 'High Yield'],
      image: formData.typeBadge === 'hen' 
        ? "/assets/poultry_fertilizer_soil.png"
        : formData.typeBadge === 'cow'
        ? "/assets/cow_fertilizer_blend.png"
        : "/assets/goat_fertilizer_pellets.png",
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const updated = [newFarm, ...farms];
    saveFarmsToStorage(updated);
    setShowRegisterModal(false);
    setShowSuccessToast(true);

    setFormData({
      name: '', ownerName: '', phone: '', farmType: 'Hen / Poultry Farm',
      typeBadge: 'hen', fertilizerType: '', quantity: '', pricePerUnit: '',
      location: '', distance: '', deliveryMode: 'Pickup & Farm Delivery', description: ''
    });
    setFormErrors({});

    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#f7f6f2] py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HERO SECTION */}
        <div className="relative rounded-3xl overflow-hidden bg-[#0a2f1d] text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[380px]">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between z-10 space-y-6">
              <div className="space-y-3">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                  Natural Fertilizers for <br />
                  <span className="text-[#e2bd66] font-serif italic">Healthier Soil & Better Yields</span>
                </h1>
                <p className="text-xs sm:text-sm font-medium text-emerald-200 tracking-wide">
                  100% Organic • Chemical Free • Farmer Approved
                </p>
              </div>

              {/* 4 Feature Circles Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-emerald-800/60">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center text-emerald-300 flex-shrink-0">
                    <Leaf className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Boost Soil Health</p>
                    <p className="text-[10px] text-emerald-200/80 leading-tight">Naturally enrich soil fertility</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center text-emerald-300 flex-shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Safe & Organic</p>
                    <p className="text-[10px] text-emerald-200/80 leading-tight">Free from harmful chemicals</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center text-emerald-300 flex-shrink-0">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Better Crop Yield</p>
                    <p className="text-[10px] text-emerald-200/80 leading-tight">Stronger plants, higher productivity</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center text-emerald-300 flex-shrink-0">
                    <IndianRupee className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">Save More</p>
                    <p className="text-[10px] text-emerald-200/80 leading-tight">Cost effective & farmer friendly</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Image Column with Nature Approved Stamp */}
            <div className="lg:col-span-5 relative min-h-[250px] lg:min-h-full">
              <img 
                src="/assets/natural_fertilizer_hero.png" 
                alt="Green Sprout in Organic Soil" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a2f1d] via-transparent to-transparent lg:block hidden"></div>
              
              {/* Circular Nature Approved Badge */}
              <div className="absolute top-6 right-6 w-20 h-20 rounded-full border-2 border-emerald-400/80 bg-[#0a2f1d]/90 backdrop-blur-md p-1 flex flex-col items-center justify-center text-center shadow-lg transform rotate-12">
                <div className="w-full h-full rounded-full border border-dashed border-emerald-300 flex flex-col items-center justify-center">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  <span className="text-[8px] font-black uppercase text-white tracking-tighter mt-0.5">NATURE</span>
                  <span className="text-[7px] font-bold uppercase text-emerald-300 tracking-widest">APPROVED</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FLOATING SEARCH & FILTER BAR */}
        <div className="relative -mt-10 z-20 max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fertilizer or location..."
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-gray-50/70 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-start md:justify-end">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'all'
                    ? 'bg-[#0a2f1d] text-white shadow-sm'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" /> All Blends
              </button>

              <button
                onClick={() => setSelectedCategory('hen')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'hen'
                    ? 'bg-[#0a2f1d] text-white shadow-sm'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🐔 Hen Manure + Sand
              </button>

              <button
                onClick={() => setSelectedCategory('cow')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'cow'
                    ? 'bg-[#0a2f1d] text-white shadow-sm'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🐮 Cow Dung + Soil
              </button>

              <button
                onClick={() => setSelectedCategory('goat')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  selectedCategory === 'goat'
                    ? 'bg-[#0a2f1d] text-white shadow-sm'
                    : 'bg-gray-100/80 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🐐 Goat Pellets + Sand
              </button>

              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-forest-900 transition-all ml-auto flex items-center gap-1 shadow-xs"
              >
                <PlusCircle className="w-3.5 h-3.5" /> List Farm
              </button>
            </div>

          </div>
        </div>

        {/* 4-COLUMN PRODUCT CARDS GRID */}
        <div className="pt-2">
          {filteredFarms.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-4">
              <Sprout className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-lg font-bold text-gray-800">No organic fertilizers matched your search</h3>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} className="btn-secondary text-xs">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFarms.map((farm) => (
                <div 
                  key={farm.id}
                  className="bg-white rounded-2xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Image Section */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img 
                        src={farm.image} 
                        alt={farm.fertilizerType} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Organic Badge top-left */}
                      <span className="absolute top-3 left-3 bg-[#0a2f1d]/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-emerald-400" /> Organic
                      </span>

                      {/* Heart Wishlist Icon top-right */}
                      <button 
                        onClick={() => toggleFavorite(farm.id)}
                        className={`absolute top-3 right-3 p-1.5 rounded-full backdrop-blur-md transition-colors ${
                          favorites[farm.id] ? 'bg-white text-red-500' : 'bg-black/40 text-white hover:bg-black/60'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites[farm.id] ? 'fill-current' : ''}`} />
                      </button>

                      {/* Distance Badge bottom-right */}
                      <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-300" /> {farm.distance} km away
                      </span>
                    </div>

                    {/* Card Content Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-emerald-800 transition-colors">
                          {farm.fertilizerType}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <span className="font-semibold text-emerald-800">{farm.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-gray-400" /> {farm.location}</span>
                        </p>
                      </div>

                      {/* Feature Tags Row */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {(farm.tags || ['Nutrient Rich', 'Soil Enricher', 'Ready to Use']).map((tag, i) => (
                          <span key={i} className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stock Available Row */}
                      <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-100">
                        <span className="flex items-center gap-1 font-medium text-gray-500">
                          <Sprout className="w-3.5 h-3.5 text-emerald-700" /> Stock Available
                        </span>
                        <span className="font-bold text-gray-900">{farm.quantity} Tons</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Action Buttons */}
                  <div className="p-5 pt-0">
                    <div className="pt-2 mb-3">
                      <p className="text-xl font-extrabold text-gray-900">
                        ₹ {farm.pricePerUnit.toLocaleString()}
                        <span className="text-xs font-normal text-gray-500"> / Ton</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${farm.phone}`}
                        className="bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 py-2.5 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5 text-gray-700" /> Call
                      </a>

                      <button
                        onClick={() => {
                          setBuyModalFarm(farm);
                          setOrderConfirmed(false);
                          setBuyQuantity(5);
                        }}
                        className="bg-[#0a2f1d] hover:bg-[#12422b] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Buy Now
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* BOTTOM VALUE PROPOSITION BAR */}
        <div className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Fast Delivery</h4>
                <p className="text-xs text-gray-500">Timely delivery to your location</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Quality Assured</h4>
                <p className="text-xs text-gray-500">Lab tested & certified organic</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Farmer Support</h4>
                <p className="text-xs text-gray-500">We're here to help you grow</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center flex-shrink-0">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">Best Prices</h4>
                <p className="text-xs text-gray-500">Direct from farms, saves more</p>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* QUICK BUY MODAL */}
      {buyModalFarm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button 
              onClick={() => setBuyModalFarm(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            {!orderConfirmed ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src={buyModalFarm.image} alt={buyModalFarm.fertilizerType} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{buyModalFarm.fertilizerType}</h3>
                    <p className="text-xs text-emerald-800 font-semibold">{buyModalFarm.name} • {buyModalFarm.location}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Your Name</label>
                    <input
                      type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
                    <input
                      type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="Enter your 10-digit phone"
                      className="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Order Tons:</span>
                      <span className="text-emerald-800">{buyQuantity} Tons</span>
                    </div>
                    <input
                      type="range" min="1" max={buyModalFarm.quantity || 30} value={buyQuantity}
                      onChange={(e) => setBuyQuantity(Number(e.target.value))}
                      className="w-full accent-emerald-800 cursor-pointer"
                    />
                  </div>

                  <div className="bg-emerald-50 p-3 rounded-xl flex justify-between items-center text-xs font-bold">
                    <span>Total Amount:</span>
                    <span className="text-base text-emerald-900">₹ {(buyQuantity * buyModalFarm.pricePerUnit).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!buyerName.trim() || !buyerPhone.trim()) {
                      alert("Please enter your name and phone number to order.");
                      return;
                    }
                    setOrderConfirmed(true);
                  }}
                  className="w-full bg-[#0a2f1d] hover:bg-[#12422b] text-white font-bold py-3 rounded-xl text-xs shadow transition-all"
                >
                  Confirm Order Request
                </button>
              </div>
            ) : (
              <div className="py-4 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Order Request Sent!</h3>
                <p className="text-xs text-gray-600">
                  Requested <strong>{buyQuantity} Tons</strong> of {buyModalFarm.fertilizerType} from <strong>{buyModalFarm.ownerName}</strong> ({buyModalFarm.phone}).
                </p>
                <button onClick={() => setBuyModalFarm(null)} className="btn-primary w-full text-xs">
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REGISTER FARM MODAL */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setShowRegisterModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-900">List Your Livestock Fertilizer Farm</h3>
              <p className="text-xs text-gray-500">Provide required details (<span className="text-red-600 font-bold">*</span>) to publish your manure & soil blend.</p>
            </div>

            {Object.keys(formErrors).length > 0 && (
              <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-xl font-bold">
                Please complete all required fields marked with *
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Farm Name *</label>
                  <input
                    type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Sri Murugan Hen Farm" className="w-full p-2 border rounded-xl"
                  />
                  {formErrors.name && <span className="text-[10px] text-red-600">{formErrors.name}</span>}
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Owner Name *</label>
                  <input
                    type="text" value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                    placeholder="e.g. Murugan Swamy" className="w-full p-2 border rounded-xl"
                  />
                  {formErrors.ownerName && <span className="text-[10px] text-red-600">{formErrors.ownerName}</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Phone (10 Digits) *</label>
                  <input
                    type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. 9876543210" className="w-full p-2 border rounded-xl"
                  />
                  {formErrors.phone && <span className="text-[10px] text-red-600">{formErrors.phone}</span>}
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={formData.farmType}
                    onChange={(e) => {
                      const val = e.target.value;
                      let badge = 'hen';
                      if (val.includes('Cow')) badge = 'cow';
                      if (val.includes('Goat')) badge = 'goat';
                      setFormData({...formData, farmType: val, typeBadge: badge});
                    }}
                    className="w-full p-2 border rounded-xl font-semibold text-gray-800"
                  >
                    <option value="Hen / Poultry Farm">🐔 Hen / Poultry Farm</option>
                    <option value="Cow / Dairy Farm">🐮 Cow / Dairy Farm</option>
                    <option value="Goat & Sheep Farm">🐐 Goat & Sheep Farm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Fertilizer + Soil Blend Name *</label>
                <input
                  type="text" value={formData.fertilizerType} onChange={(e) => setFormData({...formData, fertilizerType: e.target.value})}
                  placeholder="e.g. Hen Manure + Soil & Sand Blend" className="w-full p-2 border rounded-xl"
                />
                {formErrors.fertilizerType && <span className="text-[10px] text-red-600">{formErrors.fertilizerType}</span>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Available Tons *</label>
                  <input
                    type="number" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="50" className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Price / Ton (₹) *</label>
                  <input
                    type="number" value={formData.pricePerUnit} onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                    placeholder="1400" className="w-full p-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Distance (km) *</label>
                  <input
                    type="number" value={formData.distance} onChange={(e) => setFormData({...formData, distance: e.target.value})}
                    placeholder="14" className="w-full p-2 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Farm Location Address *</label>
                <input
                  type="text" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Kanchipuram, TN" className="w-full p-2 border rounded-xl"
                />
              </div>

              <div className="pt-2">
                <button type="submit" className="w-full bg-[#0a2f1d] text-white font-bold py-2.5 rounded-xl">
                  Publish Farm Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-[#0a2f1d] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 z-50">
          <CheckCircle2 className="w-5 h-5 text-amber-400" /> Farm Published Successfully!
        </div>
      )}

    </div>
  );
}
