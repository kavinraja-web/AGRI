import { useState, useEffect, useRef } from 'react';
import { ShoppingBasket, Search, Plus, Map, Check, Navigation2, X, RefreshCw } from 'lucide-react';
import { getProducts } from '../services/productService';
import { farmers as allFarmers } from '../data/mockData';
import { optimizeRoute } from '../services/routeOptimizer';
import RouteMap from './RouteMap';

export default function InteractiveBucketList() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState('SEARCH'); // SEARCH, QUANTITY, ADDED, ROUTE
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('kg');
  
  const [bucketItems, setBucketItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  
  const [startLocation, setStartLocation] = useState(null);
  const [routeResult, setRouteResult] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const bucketRef = useRef(null);

  useEffect(() => {
    getProducts({}).then(setAllProducts);
    
    // Default location (e.g. Chennai) for seamless flow without blocking on Geolocation prompt
    setStartLocation({ lat: 13.0827, lng: 80.2707 }); 
  }, []);

  // Autocomplete logic
  useEffect(() => {
    if (query.trim().length > 0) {
      const uniqueNames = [...new Set(allProducts.map(p => p.name))];
      const matches = uniqueNames.filter(n => n.toLowerCase().includes(query.toLowerCase()));
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [query, allProducts]);

  const handleSelectProduct = (name) => {
    setSelectedProduct(name);
    setQuery('');
    setSuggestions([]);
    setStep('QUANTITY');
  };

  const handleAddToBucket = () => {
    if (!selectedProduct || !quantity) return;

    setBucketItems(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        name: selectedProduct,
        quantity: Number(quantity),
        unit: unit
      }
    ]);

    // Animate bucket (simple pulse)
    if (bucketRef.current) {
      bucketRef.current.classList.add('scale-110');
      setTimeout(() => {
        if (bucketRef.current) bucketRef.current.classList.remove('scale-110');
      }, 200);
    }

    setStep('ADDED');
  };

  const handleCalculateRoute = () => {
    if (bucketItems.length === 0) return;
    setStep('ROUTE');
    setIsCalculating(true);

    setTimeout(() => {
      const result = optimizeRoute(bucketItems, startLocation, allProducts, allFarmers);
      setRouteResult(result);
      setIsCalculating(false);
    }, 1000);
  };

  const generateGoogleMapsLink = () => {
    if (!routeResult || !startLocation) return '#';
    const origin = `${startLocation.lat},${startLocation.lng}`;
    const destination = `${routeResult.stops[routeResult.stops.length - 1].lat},${routeResult.stops[routeResult.stops.length - 1].lng}`;
    const waypoints = routeResult.stops.slice(0, -1).map(s => `${s.lat},${s.lng}`).join('|');
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    if (waypoints) url += `&waypoints=${waypoints}`;
    return url;
  };

  // State 0: Closed (Big Red Bucket)
  if (!isOpen) {
    return (
      <div className="flex flex-col items-center justify-center mt-12 py-10">
        <p className="text-gray-500 font-bold mb-4">Smart Bucket Planner</p>
        <button 
          onClick={() => setIsOpen(true)}
          className="group relative flex flex-col items-center justify-center gap-3 transition-transform hover:scale-105"
        >
          <div className="w-32 h-32 bg-red-500 rounded-full flex items-center justify-center shadow-xl border-4 border-red-600 group-hover:bg-red-600 transition-colors">
            <ShoppingBasket className="w-16 h-16 text-white" />
          </div>
          <span className="bg-gray-900 text-white px-4 py-2 rounded-full font-bold shadow-md">
            Tap to Fill Bucket
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-white border border-red-100 rounded-3xl shadow-2xl overflow-hidden max-w-4xl mx-auto flex flex-col md:flex-row relative z-10">
      
      {/* Left Panel: The Bucket Visually */}
      <div className="bg-red-50 p-8 flex flex-col items-center justify-center md:w-1/3 border-b md:border-b-0 md:border-r border-red-100 relative">
        <div className="flex justify-between w-full md:hidden mb-4">
          <span className="font-bold text-red-800">Your Bucket</span>
          <button onClick={() => setIsOpen(false)}><X className="w-6 h-6 text-red-400" /></button>
        </div>
        
        <div 
          ref={bucketRef}
          className="w-40 h-40 bg-red-500 rounded-full flex items-center justify-center shadow-inner border-8 border-red-600 transition-transform duration-300 relative z-20"
        >
          <ShoppingBasket className="w-20 h-20 text-white" />
          {bucketItems.length > 0 && (
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 w-10 h-10 rounded-full flex items-center justify-center font-black text-xl border-4 border-white">
              {bucketItems.length}
            </div>
          )}
        </div>
        
        <div className="mt-6 w-full max-h-48 overflow-y-auto space-y-2 custom-scrollbar">
          {bucketItems.map(item => (
            <div key={item.id} className="bg-white/60 px-3 py-2 rounded-xl text-sm font-semibold flex justify-between items-center text-red-900">
              <span>{item.name}</span>
              <span>{item.quantity}{item.unit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel: Interactive Flow */}
      <div className="p-8 md:w-2/3 flex flex-col relative min-h-[400px]">
        <button onClick={() => setIsOpen(false)} className="absolute top-4 right-4 hidden md:block text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>

        {step === 'SEARCH' && (
          <div className="flex-1 flex flex-col justify-center animate-[fadeIn_0.3s_ease-out]">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">What do you want to buy?</h3>
            <p className="text-gray-500 mb-6">Type a vegetable or fruit to add to your bucket.</p>
            
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Apple, Tomato..."
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-lg font-semibold focus:outline-none focus:border-red-500 transition-colors"
                autoFocus
              />
              
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  {suggestions.map(s => (
                    <button
                      key={s}
                      onClick={() => handleSelectProduct(s)}
                      className="w-full text-left px-6 py-4 hover:bg-red-50 font-semibold text-gray-800 border-b border-gray-50 last:border-0 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {bucketItems.length > 0 && (
              <div className="mt-auto pt-6 text-right">
                <button 
                  onClick={handleCalculateRoute}
                  className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 ml-auto hover:bg-gray-800 transition-colors"
                >
                  <Map className="w-5 h-5" /> Finish & Find Route
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'QUANTITY' && (
          <div className="flex-1 flex flex-col justify-center animate-[fadeIn_0.3s_ease-out]">
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">How much {selectedProduct}?</h3>
            <p className="text-gray-500 mb-6">Enter the quantity you need.</p>
            
            <div className="flex gap-3 mb-8">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Qty"
                className="flex-1 px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-2xl font-bold focus:outline-none focus:border-red-500"
                autoFocus
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-32 px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-xl font-bold focus:outline-none focus:border-red-500"
              >
                <option value="kg">kg</option>
                <option value="g">grams</option>
                <option value="dozen">dozen</option>
                <option value="pcs">pieces</option>
              </select>
            </div>
            
            <div className="flex gap-3 mt-auto">
              <button 
                onClick={() => setStep('SEARCH')}
                className="px-6 py-4 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Back
              </button>
              <button 
                onClick={handleAddToBucket}
                disabled={!quantity}
                className="flex-1 bg-red-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-6 h-6" /> Drop into Bucket
              </button>
            </div>
          </div>
        )}

        {step === 'ADDED' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center animate-[fadeIn_0.3s_ease-out]">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <Check className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{selectedProduct} added!</h3>
            <p className="text-gray-500 mb-8">It's safely in your red bucket.</p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button 
                onClick={() => { setSelectedProduct(null); setQuantity(''); setStep('SEARCH'); }}
                className="flex-1 bg-gray-100 text-gray-800 px-6 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Add Another Item
              </button>
              <button 
                onClick={handleCalculateRoute}
                className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <Map className="w-5 h-5" /> Finish & Find Route
              </button>
            </div>
          </div>
        )}

        {step === 'ROUTE' && (
          <div className="flex-1 flex flex-col animate-[fadeIn_0.5s_ease-out]">
            {isCalculating ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <RefreshCw className="w-12 h-12 text-red-500 animate-spin mb-4" />
                <h3 className="text-xl font-bold text-gray-900">Planning Easiest Route...</h3>
              </div>
            ) : routeResult ? (
              <div className="flex flex-col h-full">
                <h3 className="text-xl font-extrabold text-gray-900 mb-4">Your Smart Route</h3>
                <div className="h-[250px] w-full rounded-2xl overflow-hidden mb-4 relative z-0">
                  <RouteMap route={routeResult} startLocation={startLocation} />
                </div>
                
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl mb-4">
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase block">Total Stops</span>
                    <span className="text-lg font-black">{routeResult.metrics.farmerCount} Farmers</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase block">Est. Cost</span>
                    <span className="text-lg font-black text-green-700">₹{routeResult.metrics.totalCost}</span>
                  </div>
                </div>

                <div className="mt-auto flex gap-3">
                  <button onClick={() => setStep('SEARCH')} className="px-4 py-3 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200">
                    Edit Bucket
                  </button>
                  <a 
                    href={generateGoogleMapsLink()} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700"
                  >
                    <Navigation2 className="w-5 h-5" /> Start Navigation
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-red-600 font-bold">
                Failed to calculate route.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
