import { useState } from 'react';
import { 
  Sprout, 
  Search, 
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
  Sparkles,
  X,
  ShoppingBag
} from 'lucide-react';
import { initialLivestockFarms, fertilizerComparisonData, cropCalculatorPresets } from '../data/fertilizerFarmsData';

export default function NaturalFertilizers() {
  const [activeTab, setActiveTab] = useState('directory'); // 'directory', 'comparison', 'register'
  
  // Farms state
  const [farms, setFarms] = useState(() => {
    const saved = localStorage.getItem('local_fertilizer_farms');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return initialLivestockFarms; }
    }
    return initialLivestockFarms;
  });

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Quick Buy Modal State
  const [buyModalFarm, setBuyModalFarm] = useState(null);
  const [buyQuantity, setBuyQuantity] = useState(5);
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [orderConfirmed, setOrderConfirmed] = useState(false);

  // Calculator State
  const [selectedCrop, setSelectedCrop] = useState('paddy');
  const [landAcres, setLandAcres] = useState(3);

  // Registration Form State
  const [formData, setFormData] = useState({
    name: '',
    ownerName: '',
    phone: '',
    farmType: 'Hen / Poultry Farm',
    typeBadge: 'hen',
    fertilizerType: 'Hen Manure + Soil & Sand Blend',
    quantity: '',
    pricePerUnit: '',
    location: '',
    distance: '',
    deliveryMode: 'Pickup & Farm Delivery',
    description: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const saveFarmsToStorage = (updatedFarms) => {
    setFarms(updatedFarms);
    localStorage.setItem('local_fertilizer_farms', JSON.stringify(updatedFarms));
  };

  // Filtered Farms
  const filteredFarms = farms.filter(farm => {
    const matchesSearch = farm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          farm.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          farm.fertilizerType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || farm.typeBadge === selectedType;
    return matchesSearch && matchesType;
  });

  // Form Submission Validation
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Farm Name is required *';
    if (!formData.ownerName.trim()) errors.ownerName = 'Owner Name is required *';
    if (!formData.phone.trim() || !/^\d{10}$/.test(formData.phone.replace(/[- ]/g, ''))) {
      errors.phone = 'Valid 10-digit Phone Number required *';
    }
    if (!formData.fertilizerType.trim()) errors.fertilizerType = 'Fertilizer & Soil Blend Name required *';
    if (!formData.quantity || Number(formData.quantity) <= 0) errors.quantity = 'Available Tons required *';
    if (!formData.pricePerUnit || Number(formData.pricePerUnit) <= 0) errors.pricePerUnit = 'Price per Ton required *';
    if (!formData.location.trim()) errors.location = 'Farm Location required *';
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
      npkRatio: 'Organic Sand & Soil Blend',
      quantity: Number(formData.quantity),
      unit: 'Tons',
      pricePerUnit: Number(formData.pricePerUnit),
      priceUnit: 'Ton',
      location: formData.location,
      distance: Number(formData.distance),
      deliveryMode: formData.deliveryMode,
      organicRating: 'Fresh Farm Soil & Manure Blend',
      verified: true,
      description: formData.description || 'Natural livestock fertilizer mixed with organic sand & soil.',
      image: formData.typeBadge === 'hen' 
        ? "/assets/poultry_fertilizer_soil.png"
        : formData.typeBadge === 'cow'
        ? "/assets/cow_fertilizer_blend.png"
        : "/assets/goat_fertilizer_pellets.png",
      dateAdded: new Date().toISOString().split('T')[0]
    };

    const updated = [newFarm, ...farms];
    saveFarmsToStorage(updated);

    setFormData({
      name: '', ownerName: '', phone: '', farmType: 'Hen / Poultry Farm',
      typeBadge: 'hen', fertilizerType: 'Hen Manure + Soil & Sand Blend',
      quantity: '', pricePerUnit: '', location: '', distance: '',
      deliveryMode: 'Pickup & Farm Delivery', description: ''
    });
    setFormErrors({});
    setShowSuccessToast(true);

    setTimeout(() => {
      setShowSuccessToast(false);
      setActiveTab('directory');
    }, 2000);
  };

  // Calculator Numbers
  const activeCrop = cropCalculatorPresets[selectedCrop] || cropCalculatorPresets.paddy;
  const chemCost = activeCrop.chemicalCostPerAcre * landAcres;
  const natCost = activeCrop.henCostPerAcre * landAcres;
  const savings = chemCost - natCost;

  return (
    <div className="min-h-screen bg-earth-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-fresh-600 rounded-3xl text-white p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-amber-400 text-forest-900 font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Natural Fertilizer Marketplace
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              Organic Manure + Soil & Sand Blends
            </h1>
            <p className="text-sm text-forest-100 max-w-2xl">
              Buy real composted Hen, Cow & Goat manure mixed with nutrient sand directly from nearby farms. Save up to 85% compared to chemical urea!
            </p>
          </div>

          <div className="flex flex-wrap gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveTab('directory')}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'directory' ? 'bg-amber-400 text-forest-900 shadow' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              🛒 Buy Fertilizers
            </button>
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'comparison' ? 'bg-amber-400 text-forest-900 shadow' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              📊 Compare Costs
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm transition-all ${
                activeTab === 'register' ? 'bg-amber-400 text-forest-900 shadow' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              + List Your Farm
            </button>
          </div>
        </div>

        {/* TAB 1: BUY NATURAL FERTILIZERS DIRECTORY */}
        {activeTab === 'directory' && (
          <div className="space-y-6">
            
            {/* Quick Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
              
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search fertilizer or location..."
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {[
                  { id: 'all', label: 'All Blends' },
                  { id: 'hen', label: '🐔 Hen Manure + Sand' },
                  { id: 'cow', label: '🐮 Cow Dung + Soil' },
                  { id: 'goat', label: '🐐 Goat Pellets + Sand' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedType(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedType === cat.id
                        ? 'bg-forest-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Farm Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFarms.map((farm) => (
                <div 
                  key={farm.id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    {/* Visual Fertilizer Image with Sand & Soil Mix */}
                    <div className="relative h-44 bg-gray-100 overflow-hidden">
                      <img 
                        src={farm.image} 
                        alt={farm.fertilizerType} 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Leaf className="w-3 h-3 text-emerald-400" />
                        Sand & Soil Organic Mix
                      </div>
                      <div className="absolute bottom-2 right-2 bg-amber-400 text-forest-900 text-[10px] font-black px-2 py-0.5 rounded-full">
                        {farm.distance} km away
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-gray-900 text-base leading-snug">
                        {farm.fertilizerType}
                      </h3>
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="font-semibold text-forest-700">{farm.name}</span>
                        <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3 text-gray-400" /> {farm.location}</span>
                      </div>

                      <div className="bg-forest-50 p-2 rounded-xl text-xs flex justify-between items-center border border-forest-100">
                        <span className="text-forest-800 font-medium">Stock Available:</span>
                        <span className="font-extrabold text-forest-900">{farm.quantity} {farm.unit}</span>
                      </div>

                      <p className="text-[11px] text-gray-600 line-clamp-2">
                        {farm.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Easy Purchase Buttons */}
                  <div className="p-4 pt-0 bg-gray-50/50 border-t border-gray-100 mt-2 space-y-3">
                    <div className="flex justify-between items-baseline pt-2">
                      <span className="text-[11px] text-gray-500 font-semibold">Direct Farm Price:</span>
                      <span className="text-lg font-black text-forest-700">
                        ₹ {farm.pricePerUnit.toLocaleString()} <span className="text-xs font-normal text-gray-500">/ Ton</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`tel:${farm.phone}`}
                        className="bg-white text-forest-700 border border-forest-300 hover:bg-forest-50 py-2 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5 text-forest-600" /> Call
                      </a>
                      <button
                        onClick={() => {
                          setBuyModalFarm(farm);
                          setOrderConfirmed(false);
                          setBuyQuantity(5);
                        }}
                        className="bg-forest-600 hover:bg-forest-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Buy Now
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: SHORT & NEAT COMPARISON */}
        {activeTab === 'comparison' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-md space-y-6">
              <div className="text-center space-y-1">
                <span className="text-xs font-extrabold text-forest-600 uppercase tracking-wider bg-forest-50 px-3 py-1 rounded-full">
                  Instant Cost Comparison
                </span>
                <h2 className="text-2xl font-bold text-gray-900">Natural Organic Fertilizer vs Chemical Urea</h2>
              </div>

              {/* Side-by-Side Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Chemical Urea Card */}
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-bold text-red-700 uppercase">🧪 Chemical Fertilizers (Urea / DAP)</span>
                  <p className="text-3xl font-black text-red-800">₹ 18,000 <span className="text-xs font-normal">/ Ton</span></p>
                  <ul className="text-xs text-red-700 space-y-1">
                    <li>❌ High expense every season</li>
                    <li>❌ Hardens farm soil & kills microbes</li>
                    <li>❌ Zero water retention</li>
                  </ul>
                </div>

                {/* Organic Soil Blend Card */}
                <div className="bg-forest-50 border border-forest-200 rounded-2xl p-5 space-y-3">
                  <span className="text-xs font-bold text-forest-700 uppercase">🌱 Organic Manure + Soil & Sand Mix</span>
                  <p className="text-3xl font-black text-forest-800">₹ 1,100 - ₹ 1,400 <span className="text-xs font-normal">/ Ton</span></p>
                  <ul className="text-xs text-forest-800 space-y-1 font-semibold">
                    <li>✓ <strong>Save 85% money</strong> per acre</li>
                    <li>✓ <strong>Enriches soil with organic sand & carbon</strong></li>
                    <li>✓ <strong>+50% water retention capacity</strong></li>
                  </ul>
                </div>

              </div>

              {/* Quick Calculator */}
              <div className="bg-gradient-to-r from-forest-800 to-fresh-600 text-white p-6 rounded-2xl space-y-4">
                <h3 className="font-bold text-lg text-white">Quick Savings Calculator</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-forest-100 font-semibold block mb-1">Select Crop:</label>
                    <select 
                      value={selectedCrop} 
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full bg-white text-gray-900 rounded-xl p-2.5 text-xs font-bold"
                    >
                      <option value="paddy">🌾 Paddy / Rice</option>
                      <option value="vegetables">🍅 Vegetables (Tomato, Chili)</option>
                      <option value="sugarcane">🎋 Sugarcane</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-forest-100 font-semibold block mb-1">Land Size (Acres): {landAcres}</label>
                    <input 
                      type="range" min="1" max="15" value={landAcres}
                      onChange={(e) => setLandAcres(Number(e.target.value))}
                      className="w-full accent-amber-400 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="bg-white/10 p-4 rounded-xl flex justify-between items-center">
                  <span className="text-xs font-medium">Your Total Money Saved:</span>
                  <span className="text-2xl font-black text-amber-300">₹ {savings.toLocaleString()}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: EASY FARM REGISTRATION FORM */}
        {activeTab === 'register' && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-6 sm:p-8 max-w-2xl mx-auto space-y-6">
            
            <div className="border-b border-gray-100 pb-4 space-y-1">
              <h2 className="text-xl font-bold text-gray-900">List Your Organic Fertilizer Farm</h2>
              <p className="text-xs text-gray-500">Fill in mandatory fields (<span className="text-red-600 font-bold">*</span>) to list your manure & soil blends.</p>
            </div>

            {Object.keys(formErrors).length > 0 && (
              <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl font-bold">
                Please complete all required fields marked with * below.
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Farm Name *</label>
                  <input
                    type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Sri Murugan Hen Farm"
                    className="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                  {formErrors.name && <span className="text-[10px] text-red-600">{formErrors.name}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Owner Name *</label>
                  <input
                    type="text" name="ownerName" value={formData.ownerName} onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                    placeholder="e.g. Murugan Swamy"
                    className="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                  {formErrors.ownerName && <span className="text-[10px] text-red-600">{formErrors.ownerName}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (10 Digits) *</label>
                  <input
                    type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="e.g. 9876543210"
                    className="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                  {formErrors.phone && <span className="text-[10px] text-red-600">{formErrors.phone}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Fertilizer + Soil Blend Name *</label>
                  <input
                    type="text" name="fertilizerType" value={formData.fertilizerType} onChange={(e) => setFormData({...formData, fertilizerType: e.target.value})}
                    placeholder="e.g. Hen Manure + Soil & Sand Blend"
                    className="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                  {formErrors.fertilizerType && <span className="text-[10px] text-red-600">{formErrors.fertilizerType}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Available Tons *</label>
                  <input
                    type="number" name="quantity" value={formData.quantity} onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    placeholder="e.g. 50"
                    className="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                  {formErrors.quantity && <span className="text-[10px] text-red-600">{formErrors.quantity}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price per Ton (₹) *</label>
                  <input
                    type="number" name="pricePerUnit" value={formData.pricePerUnit} onChange={(e) => setFormData({...formData, pricePerUnit: e.target.value})}
                    placeholder="e.g. 1400"
                    className="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                  {formErrors.pricePerUnit && <span className="text-[10px] text-red-600">{formErrors.pricePerUnit}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Distance (km) *</label>
                  <input
                    type="number" name="distance" value={formData.distance} onChange={(e) => setFormData({...formData, distance: e.target.value})}
                    placeholder="e.g. 12"
                    className="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                  />
                  {formErrors.distance && <span className="text-[10px] text-red-600">{formErrors.distance}</span>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Farm Location Address *</label>
                <input
                  type="text" name="location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Kanchipuram, Tamil Nadu"
                  className="w-full p-2.5 border rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                />
                {formErrors.location && <span className="text-[10px] text-red-600">{formErrors.location}</span>}
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-3 rounded-xl shadow transition-all text-sm"
                >
                  Publish Fertilizer Listing
                </button>
              </div>

            </form>
          </div>
        )}

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
                    <p className="text-xs text-forest-700 font-semibold">{buyModalFarm.name} • {buyModalFarm.location}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Your Name</label>
                    <input
                      type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full p-2 border rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Phone Number</label>
                    <input
                      type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)}
                      placeholder="Enter your 10-digit phone"
                      className="w-full p-2 border rounded-xl text-xs focus:ring-2 focus:ring-forest-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                      <span>Order Tons:</span>
                      <span className="text-forest-700">{buyQuantity} Tons</span>
                    </div>
                    <input
                      type="range" min="1" max={buyModalFarm.quantity || 30} value={buyQuantity}
                      onChange={(e) => setBuyQuantity(Number(e.target.value))}
                      className="w-full accent-forest-600 cursor-pointer"
                    />
                  </div>

                  <div className="bg-forest-50 p-3 rounded-xl flex justify-between items-center text-xs font-bold">
                    <span>Total Price:</span>
                    <span className="text-base text-forest-800">₹ {(buyQuantity * buyModalFarm.pricePerUnit).toLocaleString()}</span>
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
                  className="w-full bg-forest-600 hover:bg-forest-700 text-white font-bold py-3 rounded-xl text-xs shadow transition-all"
                >
                  Confirm Order Request
                </button>
              </div>
            ) : (
              <div className="py-4 text-center space-y-3">
                <div className="w-12 h-12 bg-forest-100 text-forest-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Order Confirmed!</h3>
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

      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-forest-900 text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 z-50">
          <CheckCircle2 className="w-5 h-5 text-amber-400" /> Listing Published Successfully!
        </div>
      )}

    </div>
  );
}
