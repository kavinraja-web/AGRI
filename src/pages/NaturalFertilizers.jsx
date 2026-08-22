import { useState, useEffect } from 'react';
import { 
  Sprout, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Truck, 
  ShieldCheck, 
  PlusCircle, 
  Calculator, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Leaf, 
  TrendingDown, 
  Award, 
  Sparkles,
  ChevronRight,
  X,
  Info,
  DollarSign
} from 'lucide-react';
import { initialLivestockFarms, fertilizerComparisonData, cropCalculatorPresets } from '../data/fertilizerFarmsData';

export default function NaturalFertilizers() {
  const [activeTab, setActiveTab] = useState('directory'); // 'directory', 'comparison', 'register'
  
  // Farms state (initialized from localStorage or initial dataset)
  const [farms, setFarms] = useState(() => {
    const saved = localStorage.getItem('local_fertilizer_farms');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialLivestockFarms;
      }
    }
    return initialLivestockFarms;
  });

  // Filter state for Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [maxDistance, setMaxDistance] = useState(50);
  const [selectedDelivery, setSelectedDelivery] = useState('all');

  // Booking Modal State
  const [bookingModalFarm, setBookingModalFarm] = useState(null);
  const [bookingQuantity, setBookingQuantity] = useState(5);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');

  // Calculator State
  const [selectedCrop, setSelectedCrop] = useState('paddy');
  const [landAcres, setLandAcres] = useState(3);
  const [preferredNaturalType, setPreferredNaturalType] = useState('hen');

  // Registration Form State & Errors
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    phone: '',
    farmType: 'Hen / Poultry Farm',
    typeBadge: 'hen',
    fertilizerType: 'Processed Poultry Litter',
    npkRatio: '3.0 - 2.8 - 2.0 (High Organic Nitrogen)',
    quantity: '',
    unit: 'Tons',
    pricePerUnit: '',
    priceUnit: 'Ton',
    location: '',
    distance: '',
    deliveryMode: 'Both (Pickup & Farm Truck Delivery)',
    organicRating: 'Organic Rich & Bio-Active',
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Sync farms to localStorage whenever farms change
  useEffect(() => {
    localStorage.getItem('local_fertilizer_farms');
  }, []);

  const saveFarmsToStorage = (updatedFarms) => {
    setFarms(updatedFarms);
    localStorage.setItem('local_fertilizer_farms', JSON.stringify(updatedFarms));
  };

  // Directory Filter Logic
  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          farm.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          farm.fertilizerType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || 
                        (selectedType === 'hen' && farm.typeBadge === 'hen') ||
                        (selectedType === 'goat' && farm.typeBadge === 'goat') ||
                        (selectedType === 'cow' && farm.typeBadge === 'cow') ||
                        (selectedType === 'mixed' && farm.typeBadge === 'mixed');

    const matchesDistance = Number(farm.distance) <= Number(maxDistance);

    const matchesDelivery = selectedDelivery === 'all' || 
                            (selectedDelivery === 'delivery' && farm.deliveryMode.includes('Delivery')) ||
                            (selectedDelivery === 'pickup' && farm.deliveryMode.includes('Pickup'));

    return matchesSearch && matchesType && matchesDistance && matchesDelivery;
  });

  // Handle Form Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // auto set typeBadge based on farmType selection
      if (name === 'farmType') {
        if (value.includes('Hen') || value.includes('Poultry')) updated.typeBadge = 'hen';
        else if (value.includes('Goat') || value.includes('Sheep')) updated.typeBadge = 'goat';
        else if (value.includes('Cow') || value.includes('Dairy')) updated.typeBadge = 'cow';
        else updated.typeBadge = 'mixed';
      }
      return updated;
    });

    // Clear specific field error
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Form Validation & Submission
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    // Mandatory Fields Validation
    if (!formData.name.trim()) errors.name = 'Farm Name is required';
    if (!formData.ownerName.trim()) errors.ownerName = 'Owner / Contact Person Name is required';
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ''))) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.fertilizerType.trim()) errors.fertilizerType = 'Natural Fertilizer Type is required';
    if (!formData.quantity || Number(formData.quantity) <= 0) errors.quantity = 'Valid available quantity is required';
    if (!formData.pricePerUnit || Number(formData.pricePerUnit) <= 0) errors.pricePerUnit = 'Valid price per unit is required';
    if (!formData.location.trim()) errors.location = 'Farm Address / District is required';
    if (!formData.distance || Number(formData.distance) < 0) errors.distance = 'Distance is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to top of form
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    // Create New Farm Entry
    const newFarm = {
      id: `farm-${Date.now()}`,
      name: formData.name,
      ownerName: formData.ownerName,
      phone: formData.phone,
      farmType: formData.farmType,
      typeBadge: formData.typeBadge,
      fertilizerType: formData.fertilizerType,
      npkRatio: formData.npkRatio || 'Rich Organic Manure Blend',
      quantity: Number(formData.quantity),
      unit: formData.unit,
      pricePerUnit: Number(formData.pricePerUnit),
      priceUnit: formData.priceUnit,
      location: formData.location,
      distance: Number(formData.distance),
      deliveryMode: formData.deliveryMode,
      organicRating: formData.organicRating || 'Fresh Local Organic Manure',
      verified: true,
      description: formData.description || 'Locally sourced organic fertilizer from live farm stock.',
      image: formData.typeBadge === 'hen' 
        ? "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&q=80&w=600&h=400"
        : formData.typeBadge === 'goat'
        ? "https://images.unsplash.com/photo-1533318087102-b3ad366ed041?auto=format&fit=crop&q=80&w=600&h=400"
        : "https://images.unsplash.com/photo-1570042707222-6b3a3d6b0e8b?auto=format&fit=crop&q=80&w=600&h=400",
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const updated = [newFarm, ...farms];
    saveFarmsToStorage(updated);

    // Reset Form
    setFormData({
      name: '',
      ownerName: '',
      phone: '',
      farmType: 'Hen / Poultry Farm',
      typeBadge: 'hen',
      fertilizerType: 'Processed Poultry Litter',
      npkRatio: '3.0 - 2.8 - 2.0 (High Organic Nitrogen)',
      quantity: '',
      unit: 'Tons',
      pricePerUnit: '',
      priceUnit: 'Ton',
      location: '',
      distance: '',
      deliveryMode: 'Both (Pickup & Farm Truck Delivery)',
      organicRating: 'Organic Rich & Bio-Active',
      description: ''
    });
    setFormErrors({});
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
      setActiveTab('directory');
    }, 2500);
  };

  // Calculator Calculations
  const activeCropInfo = cropCalculatorPresets[selectedCrop] || cropCalculatorPresets.paddy;
  const chemicalCostTotal = activeCropInfo.chemicalCostPerAcre * landAcres;
  
  let naturalCostPerAcre = activeCropInfo.henCostPerAcre;
  if (preferredNaturalType === 'goat') naturalCostPerAcre = activeCropInfo.goatCostPerAcre;
  if (preferredNaturalType === 'cow') naturalCostPerAcre = activeCropInfo.cowCostPerAcre;

  const naturalCostTotal = naturalCostPerAcre * landAcres;
  const netSavingsTotal = chemicalCostTotal - naturalCostTotal;
  const totalTonsRequired = (activeCropInfo.recommendedTonsPerAcre * landAcres).toFixed(1);

  return (
    <div className="min-h-screen bg-earth-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-forest-800 via-forest-700 to-fresh-600 rounded-3xl text-white p-8 sm:p-12 shadow-xl">
          <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
            <Leaf className="w-96 h-96" />
          </div>

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium text-forest-100">
              <Sparkles className="w-4 h-4 text-amber-300" />
              Direct Farm-to-Farm Eco Network
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Natural Fertilizer Hub <br className="hidden sm:inline" />
              <span className="text-amber-300">Hen, Goat & Cow Farms</span>
            </h1>

            <p className="text-base sm:text-lg text-forest-100 font-normal leading-relaxed">
              Connect directly with local livestock farms to get raw & aged organic manure (poultry litter, goat pellets, cow dung). Save up to 75% on fertilizer expenses while restoring permanent soil biological fertility!
            </p>

            <div className="pt-4 flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveTab('directory')}
                className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'directory' 
                    ? 'bg-amber-400 text-forest-900 shadow-lg scale-105' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <Sprout className="w-5 h-5" />
                Browse Local Farms ({farms.length})
              </button>

              <button 
                onClick={() => setActiveTab('comparison')}
                className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'comparison' 
                    ? 'bg-amber-400 text-forest-900 shadow-lg scale-105' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <Calculator className="w-5 h-5" />
                Cost Savings Calculator
              </button>

              <button 
                onClick={() => setActiveTab('register')}
                className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 ${
                  activeTab === 'register' 
                    ? 'bg-amber-400 text-forest-900 shadow-lg scale-105' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                Register Your Farm
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex border-b border-gray-200 bg-white p-2 rounded-2xl shadow-sm">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex-1 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'directory' 
                ? 'bg-forest-600 text-white shadow' 
                : 'text-gray-600 hover:text-forest-700 hover:bg-forest-50'
            }`}
          >
            <Sprout className="w-5 h-5" />
            Local Farms Directory
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`flex-1 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'comparison' 
                ? 'bg-forest-600 text-white shadow' 
                : 'text-gray-600 hover:text-forest-700 hover:bg-forest-50'
            }`}
          >
            <Calculator className="w-5 h-5" />
            Natural vs Chemical Comparison
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-sm sm:text-base font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              activeTab === 'register' 
                ? 'bg-forest-600 text-white shadow' 
                : 'text-gray-600 hover:text-forest-700 hover:bg-forest-50'
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            + Register Livestock Farm
          </button>
        </div>

        {/* TAB 1: LOCAL FARMS DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            
            {/* Filter Controls Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                
                {/* Search Bar */}
                <div className="relative flex-1 w-full">
                  <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by farm name, location (e.g. Kanchipuram), or manure type..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent transition-all text-sm"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Distance Slider */}
                <div className="w-full md:w-64 bg-forest-50 p-3 rounded-xl border border-forest-100 space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-forest-800">
                    <span>Max Distance:</span>
                    <span>{maxDistance} km</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    step="5"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(e.target.value)}
                    className="w-full accent-forest-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Type Filter Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                <span className="text-xs font-semibold text-gray-400 self-center mr-2">Filter Farm Stock:</span>
                
                <button
                  onClick={() => setSelectedType('all')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    selectedType === 'all' 
                      ? 'bg-gray-900 text-white shadow-sm' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Farms ({farms.length})
                </button>

                <button
                  onClick={() => setSelectedType('hen')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    selectedType === 'hen' 
                      ? 'bg-amber-600 text-white shadow-sm' 
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
                  }`}
                >
                  🐔 Hen / Poultry Farms
                </button>

                <button
                  onClick={() => setSelectedType('goat')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    selectedType === 'goat' 
                      ? 'bg-emerald-700 text-white shadow-sm' 
                      : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  }`}
                >
                  🐐 Goat / Sheep Farms
                </button>

                <button
                  onClick={() => setSelectedType('cow')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    selectedType === 'cow' 
                      ? 'bg-sky-700 text-white shadow-sm' 
                      : 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                  }`}
                >
                  🐮 Cow / Dairy Farms
                </button>

                <button
                  onClick={() => setSelectedType('mixed')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    selectedType === 'mixed' 
                      ? 'bg-purple-700 text-white shadow-sm' 
                      : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  🌾 Mixed Livestock
                </button>
              </div>
            </div>

            {/* Farms Grid */}
            {filteredFarms.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 space-y-4">
                <Sprout className="w-16 h-16 text-gray-300 mx-auto" />
                <h3 className="text-xl font-bold text-gray-800">No farms matched your filter</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Try adjusting your search query, increasing distance radius, or clearing farm type filters.
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedType('all'); setMaxDistance(100); }}
                  className="btn-secondary"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredFarms.map((farm) => (
                  <div 
                    key={farm.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image header with badge */}
                      <div className="relative h-48 overflow-hidden bg-gray-100">
                        <img 
                          src={farm.image} 
                          alt={farm.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                            farm.typeBadge === 'hen' 
                              ? 'bg-amber-500 text-white' 
                              : farm.typeBadge === 'goat'
                              ? 'bg-emerald-600 text-white'
                              : farm.typeBadge === 'cow'
                              ? 'bg-sky-600 text-white'
                              : 'bg-purple-600 text-white'
                          }`}>
                            {farm.typeBadge === 'hen' && '🐔 Hen Farm'}
                            {farm.typeBadge === 'goat' && '🐐 Goat Farm'}
                            {farm.typeBadge === 'cow' && '🐮 Cow Dairy'}
                            {farm.typeBadge === 'mixed' && '🌾 Mixed Farm'}
                          </span>
                        </div>

                        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-300" />
                          {farm.distance} km away
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-4">
                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-900 text-lg group-hover:text-forest-600 transition-colors">
                              {farm.name}
                            </h3>
                            {farm.verified && (
                              <ShieldCheck className="w-5 h-5 text-forest-600 flex-shrink-0" title="Verified Farm Owner" />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            {farm.location}
                          </p>
                        </div>

                        {/* Product Detail Pill */}
                        <div className="bg-forest-50 p-3 rounded-xl border border-forest-100 space-y-1">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-forest-700 font-semibold uppercase tracking-wider">
                              Natural Manure Type:
                            </span>
                            <span className="text-xs text-forest-800 font-bold">
                              {farm.unit} Available: {farm.quantity}
                            </span>
                          </div>
                          <p className="text-sm font-bold text-gray-900">
                            {farm.fertilizerType}
                          </p>
                          <p className="text-xs text-forest-600 font-medium">
                            NPK: {farm.npkRatio}
                          </p>
                        </div>

                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {farm.description}
                        </p>

                        {/* Delivery Option Tag */}
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                          <Truck className="w-4 h-4 text-forest-600" />
                          <span>{farm.deliveryMode}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Footer Actions */}
                    <div className="p-5 pt-0 border-t border-gray-100 bg-gray-50/50 mt-4">
                      <div className="flex items-center justify-between pt-4">
                        <div>
                          <span className="text-xs text-gray-500 font-medium">Farm Price</span>
                          <p className="text-xl font-extrabold text-forest-700">
                            ₹ {farm.pricePerUnit.toLocaleString()}
                            <span className="text-xs font-normal text-gray-500"> / {farm.priceUnit}</span>
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setBookingModalFarm(farm);
                            setBookingSuccess(false);
                            setBookingQuantity(5);
                          }}
                          className="bg-forest-600 hover:bg-forest-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1.5"
                        >
                          <Phone className="w-4 h-4" />
                          Order Manure
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NATURAL VS ARTIFICIAL COMPARISON & CALCULATOR */}
        {activeTab === 'comparison' && (
          <div className="space-y-10">
            
            {/* Interactive Crop Savings Calculator */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-gray-100 pb-4 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest-600 bg-forest-50 px-3 py-1 rounded-full mb-2">
                    <Calculator className="w-4 h-4" /> Real-time ROI Calculator
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Calculate Your Farm Savings</h2>
                  <p className="text-sm text-gray-500">See how much money you save by switching to local Hen, Goat & Cow manure</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Inputs Column */}
                <div className="space-y-5 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      1. Select Your Crop Type:
                    </label>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl p-3 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    >
                      <option value="paddy">🌾 Paddy / Rice (Heavy N Requirement)</option>
                      <option value="sugarcane">🎋 Sugarcane (High Organic Tonnage)</option>
                      <option value="vegetables">🍅 Vegetables (Tomato, Chili, Onion)</option>
                      <option value="banana">🍌 Banana & Fruit Orchards</option>
                      <option value="cotton">☁️ Cotton & Maize</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                        2. Land Size (Acres):
                      </label>
                      <span className="text-sm font-extrabold text-forest-700 bg-forest-100 px-3 py-0.5 rounded-full">
                        {landAcres} Acres
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      step="1"
                      value={landAcres}
                      onChange={(e) => setLandAcres(Number(e.target.value))}
                      className="w-full accent-forest-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1 Acre</span>
                      <span>12 Acres</span>
                      <span>25 Acres</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                      3. Preferred Livestock Manure Source:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPreferredNaturalType('hen')}
                        className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                          preferredNaturalType === 'hen'
                            ? 'bg-amber-500 text-white shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        🐔 Hen Farm
                      </button>
                      <button
                        onClick={() => setPreferredNaturalType('goat')}
                        className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                          preferredNaturalType === 'goat'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        🐐 Goat Farm
                      </button>
                      <button
                        onClick={() => setPreferredNaturalType('cow')}
                        className={`p-2.5 rounded-xl text-xs font-bold text-center transition-all ${
                          preferredNaturalType === 'cow'
                            ? 'bg-sky-600 text-white shadow-sm'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        🐮 Cow Farm
                      </button>
                    </div>
                  </div>
                </div>

                {/* Outputs & Savings Visualizer */}
                <div className="lg:col-span-2 space-y-6 flex flex-col justify-between">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Chemical Cost Box */}
                    <div className="bg-red-50 p-5 rounded-2xl border border-red-100 space-y-2">
                      <span className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-1">
                        <TrendingDown className="w-4 h-4" /> Chemical Fertilizer Expense
                      </span>
                      <p className="text-3xl font-extrabold text-red-800">
                        ₹ {chemicalCostTotal.toLocaleString()}
                      </p>
                      <p className="text-xs text-red-600">
                        Based on market rates for Chemical Urea, DAP & Potash across {landAcres} acres.
                      </p>
                    </div>

                    {/* Natural Manure Cost Box */}
                    <div className="bg-forest-50 p-5 rounded-2xl border border-forest-100 space-y-2">
                      <span className="text-xs font-bold text-forest-700 uppercase tracking-wider flex items-center gap-1">
                        <Leaf className="w-4 h-4 text-forest-600" /> Local Natural Manure Cost
                      </span>
                      <p className="text-3xl font-extrabold text-forest-800">
                        ₹ {naturalCostTotal.toLocaleString()}
                      </p>
                      <p className="text-xs text-forest-700">
                        Total {totalTonsRequired} Tons of organic farm manure required.
                      </p>
                    </div>
                  </div>

                  {/* Net Money Saved Highlight Box */}
                  <div className="bg-gradient-to-r from-emerald-600 to-forest-700 text-white p-6 rounded-2xl shadow-lg space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-emerald-100 flex items-center gap-1.5">
                        <Sparkles className="w-5 h-5 text-amber-300" /> Total Net Money Saved
                      </span>
                      <span className="bg-amber-400 text-forest-900 text-xs font-extrabold px-3 py-1 rounded-full">
                        Save {Math.round((netSavingsTotal / chemicalCostTotal) * 100)}%
                      </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl sm:text-5xl font-black text-amber-300">
                        ₹ {netSavingsTotal.toLocaleString()}
                      </span>
                      <span className="text-xs text-emerald-100">per season for {landAcres} acres</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/20 text-xs text-emerald-100">
                      <div>
                        ✓ Soil Organic Score: <strong className="text-white">+48% Increase</strong>
                      </div>
                      <div>
                        ✓ Chemical Runoff: <strong className="text-white">100% Zero Toxicity</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => setActiveTab('directory')}
                      className="bg-forest-600 hover:bg-forest-700 text-white px-6 py-3 rounded-full font-semibold transition-all flex items-center gap-2 text-sm shadow-md"
                    >
                      Find Nearby Manure Suppliers Now <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            </div>

            {/* Comparison Matrix Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-md p-6 sm:p-8 space-y-6 overflow-hidden">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Side-by-Side Natural vs Chemical Matrix</h2>
                <p className="text-sm text-gray-500">Comparing Hen, Goat, and Cow manure directly with Artificial Fertilizers</p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-forest-900 text-white text-xs uppercase tracking-wider">
                      <th className="p-4 rounded-tl-xl">Feature / Metric</th>
                      <th className="p-4 bg-amber-700">🐔 Hen Manure</th>
                      <th className="p-4 bg-emerald-800">🐐 Goat Pellets</th>
                      <th className="p-4 bg-sky-800">🐮 Cow Dung</th>
                      <th className="p-4 bg-red-900">🧪 Chemical (Urea/DAP)</th>
                      <th className="p-4 rounded-tr-xl">Winner</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {fertilizerComparisonData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="p-4 font-bold text-gray-900">{row.metric}</td>
                        <td className="p-4 text-amber-900 bg-amber-50/30">{row.naturalHen}</td>
                        <td className="p-4 text-emerald-900 bg-emerald-50/30">{row.naturalGoat}</td>
                        <td className="p-4 text-sky-900 bg-sky-50/30">{row.naturalCow}</td>
                        <td className="p-4 text-red-900 bg-red-50/30 line-through opacity-80">{row.artificialChemical}</td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-forest-700 bg-forest-100 px-3 py-1 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                            {row.winner}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: REGISTER YOUR LIVESTOCK FARM (MANDATORY FIELDS ENFORCED) */}
        {activeTab === 'register' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 space-y-8 max-w-4xl mx-auto">
            
            {/* Header */}
            <div className="border-b border-gray-100 pb-6 space-y-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-forest-600 bg-forest-50 px-3 py-1 rounded-full">
                <PlusCircle className="w-4 h-4" /> Livestock Farm Enrollment
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                Register Your Farm to Sell Organic Manure
              </h2>
              <p className="text-sm text-gray-600">
                Are you a Hen Farm, Goat Farm, or Cow/Dairy owner? List your farm waste & organic manure so nearby crop farmers can purchase directly from you.
              </p>
            </div>

            {/* Mandatory Notice Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Mandatory Details Enforced:</strong> All fields marked with a red asterisk (<span className="text-red-600 font-bold">*</span>) are mandatory. Providing complete farm details ensures farmers can verify your location and contact you directly.
              </div>
            </div>

            {/* General Form Error Banner */}
            {Object.keys(formErrors).length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-800 text-xs sm:text-sm font-semibold flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span>Please complete all required fields highlighted in red below.</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-6">
              
              {/* Row 1: Farm Name & Owner Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Farm Name <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Sri Murugan Poultry & Hen Farm"
                    className={`w-full p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.name ? 'border-red-500 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-forest-500'
                    }`}
                  />
                  {formErrors.name && <p className="text-xs text-red-600 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Farm Owner / Contact Person <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                    placeholder="e.g. Murugan Swamy"
                    className={`w-full p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.ownerName ? 'border-red-500 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-forest-500'
                    }`}
                  />
                  {formErrors.ownerName && <p className="text-xs text-red-600 mt-1">{formErrors.ownerName}</p>}
                </div>
              </div>

              {/* Row 2: Phone & Farm Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Contact Phone Number <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="e.g. 9876543210 (10 digits)"
                    className={`w-full p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.phone ? 'border-red-500 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-forest-500'
                    }`}
                  />
                  {formErrors.phone && <p className="text-xs text-red-600 mt-1">{formErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Farm Category <span className="text-red-600 font-bold">*</span>
                  </label>
                  <select
                    name="farmType"
                    value={formData.farmType}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  >
                    <option value="Hen / Poultry Farm">🐔 Hen / Poultry Farm</option>
                    <option value="Goat & Sheep Farm">🐐 Goat & Sheep Farm</option>
                    <option value="Cow / Dairy Farm">🐮 Cow / Dairy Farm</option>
                    <option value="Mixed Livestock (Cow & Goat)">🌾 Mixed Livestock Farm</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Fertilizer Type & NPK Rating */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Manure / Fertilizer Type <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="fertilizerType"
                    value={formData.fertilizerType}
                    onChange={handleInputChange}
                    placeholder="e.g. Dry Layer Hen Litter / Goat Manure Pellets"
                    className={`w-full p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.fertilizerType ? 'border-red-500 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-forest-500'
                    }`}
                  />
                  {formErrors.fertilizerType && <p className="text-xs text-red-600 mt-1">{formErrors.fertilizerType}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    NPK / Organic Quality Note
                  </label>
                  <input
                    type="text"
                    name="npkRatio"
                    value={formData.npkRatio}
                    onChange={handleInputChange}
                    placeholder="e.g. 3.0 - 2.8 - 2.0 (High Organic N)"
                    className="w-full p-3 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Quantity & Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Available Quantity <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="e.g. 50"
                    className={`w-full p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.quantity ? 'border-red-500 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-forest-500'
                    }`}
                  />
                  {formErrors.quantity && <p className="text-xs text-red-600 mt-1">{formErrors.quantity}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Unit Measurement
                  </label>
                  <select
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  >
                    <option value="Tons">Tons</option>
                    <option value="Bags (50kg)">Bags (50kg)</option>
                    <option value="Tractor Loads">Tractor Loads</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Price per Unit (₹) <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    name="pricePerUnit"
                    value={formData.pricePerUnit}
                    onChange={handleInputChange}
                    placeholder="e.g. 1400"
                    className={`w-full p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.pricePerUnit ? 'border-red-500 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-forest-500'
                    }`}
                  />
                  {formErrors.pricePerUnit && <p className="text-xs text-red-600 mt-1">{formErrors.pricePerUnit}</p>}
                </div>
              </div>

              {/* Row 5: Location & Distance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Farm Address & District <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Kanchipuram, Tamil Nadu"
                    className={`w-full p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.location ? 'border-red-500 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-forest-500'
                    }`}
                  />
                  {formErrors.location && <p className="text-xs text-red-600 mt-1">{formErrors.location}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Distance from Town Center (km) <span className="text-red-600 font-bold">*</span>
                  </label>
                  <input
                    type="number"
                    name="distance"
                    value={formData.distance}
                    onChange={handleInputChange}
                    placeholder="e.g. 15"
                    className={`w-full p-3 rounded-xl border text-sm font-medium focus:outline-none focus:ring-2 ${
                      formErrors.distance ? 'border-red-500 bg-red-50 focus:ring-red-300' : 'border-gray-300 focus:ring-forest-500'
                    }`}
                  />
                  {formErrors.distance && <p className="text-xs text-red-600 mt-1">{formErrors.distance}</p>}
                </div>
              </div>

              {/* Row 6: Delivery mode & Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Pickup / Delivery Option <span className="text-red-600 font-bold">*</span>
                </label>
                <select
                  name="deliveryMode"
                  value={formData.deliveryMode}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm font-semibold text-gray-800 focus:ring-2 focus:ring-forest-500 focus:outline-none"
                >
                  <option value="Both (Pickup & Farm Truck Delivery)">Both (Self Pickup & Farm Truck Delivery)</option>
                  <option value="Self Pickup Only">Self Pickup Only</option>
                  <option value="Farm Truck Delivery Available">Farm Truck Delivery Available</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Farm Description & Manure Moisture/Quality Notes
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your organic manure processing, decomposition stage, moisture content, or delivery options..."
                  className="w-full p-3 rounded-xl border border-gray-300 text-sm font-medium focus:ring-2 focus:ring-forest-500 focus:outline-none"
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-forest-600 hover:bg-forest-700 text-white font-bold px-8 py-3.5 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2 text-base"
                >
                  <PlusCircle className="w-5 h-5" />
                  Publish Farm Details to Platform
                </button>
              </div>

            </form>
          </div>
        )}

      </div>

      {/* SUCCESS CONFIRMATION TOAST / MODAL */}
      {showSuccessToast && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl border border-forest-100">
            <div className="w-16 h-16 bg-forest-100 text-forest-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">Farm Successfully Published!</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your farm details have been registered on the Natural Fertilizer Platform. Local crop farmers in your area can now contact you directly for organic manure orders!
            </p>
            <div className="pt-2 text-xs font-semibold text-forest-700">
              Redirecting to live directory...
            </div>
          </div>
        </div>
      )}

      {/* BOOKING / ORDER MODAL */}
      {bookingModalFarm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 relative">
            
            <button 
              onClick={() => setBookingModalFarm(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="w-6 h-6" />
            </button>

            {!bookingSuccess ? (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-forest-100 rounded-2xl flex items-center justify-center text-forest-700">
                    <Sprout className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{bookingModalFarm.name}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {bookingModalFarm.location} ({bookingModalFarm.distance} km)
                    </p>
                  </div>
                </div>

                <div className="bg-forest-50 p-4 rounded-2xl border border-forest-100 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-gray-900 text-sm">
                    <span>{bookingModalFarm.fertilizerType}</span>
                    <span className="text-forest-700">₹ {bookingModalFarm.pricePerUnit} / {bookingModalFarm.priceUnit}</span>
                  </div>
                  <p className="text-forest-800">
                    <strong>Owner Contact:</strong> {bookingModalFarm.ownerName} ({bookingModalFarm.phone})
                  </p>
                  <p className="text-forest-700">
                    <strong>Delivery Mode:</strong> {bookingModalFarm.deliveryMode}
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Your Name (Crop Farmer)
                    </label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                      Your Phone Number
                    </label>
                    <input
                      type="tel"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="Enter your 10-digit phone number"
                      className="w-full p-3 rounded-xl border border-gray-300 text-sm focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Order Quantity ({bookingModalFarm.priceUnit}s):</span>
                      <span className="text-forest-700">{bookingQuantity} {bookingModalFarm.priceUnit}s</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max={bookingModalFarm.quantity || 50}
                      value={bookingQuantity}
                      onChange={(e) => setBookingQuantity(Number(e.target.value))}
                      className="w-full accent-forest-600 cursor-pointer"
                    />
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl flex justify-between items-center text-sm font-bold text-gray-900">
                    <span>Estimated Total Amount:</span>
                    <span className="text-xl font-extrabold text-forest-700">
                      ₹ {(bookingQuantity * bookingModalFarm.pricePerUnit).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <a
                    href={`tel:${bookingModalFarm.phone}`}
                    className="flex-1 bg-white text-forest-700 border-2 border-forest-600 hover:bg-forest-50 py-3 rounded-xl font-bold text-center text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Call Owner Directly
                  </a>

                  <button
                    onClick={() => {
                      if (!buyerName.trim() || !buyerPhone.trim()) {
                        alert("Please enter your name and contact phone number to submit an order request.");
                        return;
                      }
                      setBookingSuccess(true);
                    }}
                    className="flex-1 bg-forest-600 hover:bg-forest-700 text-white py-3 rounded-xl font-bold text-center text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Send Booking Order
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-forest-100 text-forest-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Manure Booking Requested!</h3>
                <p className="text-sm text-gray-600">
                  Your order request for <strong>{bookingQuantity} {bookingModalFarm.priceUnit}s</strong> of {bookingModalFarm.fertilizerType} has been sent to <strong>{bookingModalFarm.ownerName}</strong> ({bookingModalFarm.phone}).
                </p>
                <div className="bg-forest-50 p-3 rounded-xl text-xs text-forest-800 font-medium">
                  The farm owner will contact you shortly to confirm pickup / delivery timing.
                </div>
                <button
                  onClick={() => setBookingModalFarm(null)}
                  className="btn-primary w-full"
                >
                  Done
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
