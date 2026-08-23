import { useState, useEffect } from 'react';
import { ShoppingBasket, Plus, Trash2, MapPin, Navigation, Map as MapIcon, RefreshCw, AlertCircle, Sparkles, Navigation2 } from 'lucide-react';
import { getProducts } from '../services/productService';
import { farmers as allFarmers } from '../data/mockData';
import { optimizeRoute } from '../services/routeOptimizer';
import RouteMap from '../components/RouteMap';

export default function BucketList() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQty, setNewItemQty] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('kg');
  
  const [startLocation, setStartLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationName, setLocationName] = useState('');

  const [isCalculating, setIsCalculating] = useState(false);
  const [routeResult, setRouteResult] = useState(null);
  const [error, setError] = useState('');

  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    getProducts({}).then(setAllProducts);
  }, []);

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemQty) return;
    
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        name: newItemName.trim(),
        quantity: Number(newItemQty),
        unit: newItemUnit
      }
    ]);
    
    setNewItemName('');
    setNewItemQty('');
    setNewItemUnit('kg');
  };

  const handleRemoveItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  const getLocation = () => {
    setIsLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setStartLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setLocationName('Current Location');
        setIsLocating(false);
      },
      (err) => {
        setError('Failed to get location. Please enable location services.');
        setIsLocating(false);
      }
    );
  };

  // Mock Chennai location for demo purposes if geolocation fails
  const useMockLocation = () => {
    setStartLocation({ lat: 13.0827, lng: 80.2707 });
    setLocationName('Chennai (Demo Location)');
  };

  const handleCalculateRoute = () => {
    if (items.length === 0) {
      setError('Please add at least one item to your bucket list.');
      return;
    }
    if (!startLocation) {
      setError('Please select your starting location.');
      return;
    }

    setError('');
    setIsCalculating(true);
    setRouteResult(null);

    // Simulate AI thinking time for UI effect
    setTimeout(() => {
      const result = optimizeRoute(items, startLocation, allProducts, allFarmers);
      setRouteResult(result || { error: 'No farmers found for these items.' });
      setIsCalculating(false);
    }, 1500);
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="bg-forest-800 text-white pt-16 pb-12 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <ShoppingBasket className="w-96 h-96 -mt-20 -mr-20" />
        </div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4 flex items-center justify-center gap-3">
            <ShoppingBasket className="w-10 h-10 text-amber-400" />
            My Bucket List
          </h1>
          <p className="text-forest-100 text-lg max-w-2xl mx-auto">
            Plan your farm shopping. Enter all the products you need, and our AI will calculate the most efficient route across multiple local farmers to get everything you need!
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Bucket List Entry */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                📝 Items Needed
              </h2>
              
              <form onSubmit={handleAddItem} className="flex gap-2 mb-6">
                <input
                  type="text"
                  placeholder="e.g. Tomato"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  min="0.1"
                  step="any"
                  value={newItemQty}
                  onChange={(e) => setNewItemQty(e.target.value)}
                  className="w-20 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-500"
                />
                <select
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-2 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest-500"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="pcs">pcs</option>
                  <option value="dozen">dozen</option>
                </select>
                <button
                  type="submit"
                  className="bg-forest-600 text-white p-2.5 rounded-xl hover:bg-forest-700 transition-colors flex-shrink-0"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </form>

              {items.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <ShoppingBasket className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 font-medium">Your list is empty</p>
                  <p className="text-xs text-gray-400 mt-1">Add items above to start planning.</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-white border border-gray-100 shadow-sm rounded-xl p-3">
                      <div className="font-semibold text-gray-800">{item.name}</div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-forest-700 bg-forest-50 px-2.5 py-1 rounded-lg">
                          {item.quantity} {item.unit}
                        </span>
                        <button onClick={() => handleRemoveItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                📍 Starting Location
              </h2>
              {startLocation ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <MapPin className="text-emerald-600 w-5 h-5" />
                    <div>
                      <p className="font-semibold text-emerald-900">{locationName}</p>
                      <p className="text-xs text-emerald-700">{startLocation.lat.toFixed(4)}, {startLocation.lng.toFixed(4)}</p>
                    </div>
                  </div>
                  <button onClick={() => setStartLocation(null)} className="text-emerald-700 hover:text-emerald-900 text-sm font-medium">Change</button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <button
                    onClick={getLocation}
                    disabled={isLocating}
                    className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors"
                  >
                    {isLocating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
                    Use Current Location
                  </button>
                  <button
                    onClick={useMockLocation}
                    className="w-full flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                  >
                    <MapIcon className="w-5 h-5 text-gray-400" />
                    Use Demo Location (Chennai)
                  </button>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 p-4 rounded-xl text-sm border border-red-200">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={handleCalculateRoute}
              disabled={isCalculating || items.length === 0 || !startLocation}
              className="w-full relative overflow-hidden group bg-gradient-to-r from-forest-600 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <div className="relative flex items-center justify-center gap-2">
                {isCalculating ? (
                  <><RefreshCw className="w-6 h-6 animate-spin" /> Calculating AI Route...</>
                ) : (
                  <><Sparkles className="w-6 h-6" /> Find Best Farmer Route</>
                )}
              </div>
            </button>
          </div>

          {/* Right Column: Results & Map */}
          <div className="lg:col-span-7">
            {!routeResult && !isCalculating && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 bg-forest-50 rounded-full flex items-center justify-center mb-4">
                  <MapIcon className="w-10 h-10 text-forest-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Route Map</h3>
                <p className="text-gray-500 max-w-sm">
                  Add items to your bucket list and calculate to see the AI-optimized journey across multiple farms.
                </p>
              </div>
            )}

            {isCalculating && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 relative mb-4">
                  <div className="absolute inset-0 border-4 border-forest-200 border-t-forest-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-2 border-4 border-emerald-200 border-b-emerald-500 rounded-full animate-spin-reverse"></div>
                  <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-forest-600 animate-pulse" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI is Planning Your Route</h3>
                <p className="text-gray-500 max-w-sm animate-pulse">
                  Analyzing {items.length} items across {allProducts.length} local inventory records to find the most efficient stops...
                </p>
              </div>
            )}

            {routeResult && !isCalculating && !routeResult.error && (
              <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                {/* Metrics Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    Your Smart Farm Route
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Distance</p>
                      <p className="text-2xl font-black text-gray-900">{routeResult.metrics.totalDistance} <span className="text-sm font-medium text-gray-500">km</span></p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Time</p>
                      <p className="text-2xl font-black text-gray-900">{routeResult.metrics.travelTime} <span className="text-sm font-medium text-gray-500">min</span></p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Stops</p>
                      <p className="text-2xl font-black text-gray-900">{routeResult.metrics.farmerCount}</p>
                    </div>
                    <div className="bg-forest-50 rounded-2xl p-4 text-center border border-forest-100">
                      <p className="text-xs text-forest-700 font-bold uppercase tracking-wider mb-1">Total Cost</p>
                      <p className="text-2xl font-black text-forest-900">₹{routeResult.metrics.totalCost}</p>
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="relative">
                  <RouteMap route={routeResult} startLocation={startLocation} />
                  
                  {/* Google Maps Nav Button */}
                  <a
                    href={generateGoogleMapsLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-xl hover:bg-black transition-transform hover:scale-105 flex items-center gap-2"
                  >
                    <Navigation2 className="w-5 h-5" />
                    Open Route in Google Maps
                  </a>
                </div>

                {/* Stops Details */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Route Breakdown</h3>
                  
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                    
                    {/* Start */}
                    <div className="relative pl-12 mb-8">
                      <div className="absolute left-2.5 top-1 w-3.5 h-3.5 rounded-full bg-blue-500 border-2 border-white shadow-sm z-10"></div>
                      <h4 className="font-bold text-gray-900">{locationName || 'Starting Location'}</h4>
                    </div>

                    {/* Farmers */}
                    {routeResult.stops.map((stop, i) => (
                      <div key={stop.farmerId} className="relative pl-12 mb-8 last:mb-0">
                        <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-forest-600 text-white flex items-center justify-center font-bold text-sm shadow-md z-10 border-2 border-white">
                          {i + 1}
                        </div>
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-bold text-gray-900 text-lg">{stop.farmerName}</h4>
                              <p className="text-sm text-gray-500">{stop.location}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500 font-medium block">Stop Cost</span>
                              <span className="font-bold text-forest-700">₹{stop.stopCost}</span>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            {stop.itemsToBuy.map(item => (
                              <div key={item.reqId} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-gray-100">
                                <span className="font-medium text-gray-800 flex items-center gap-2">
                                  <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-bold">
                                    {item.reqQuantity} {item.unit}
                                  </span>
                                  {item.reqName}
                                </span>
                                <span className="text-sm font-semibold text-gray-600">₹{item.price * (item.reqQuantity || 1)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unfulfilled Items Alert */}
                {routeResult.unfulfilledItems && routeResult.unfulfilledItems.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6">
                    <h3 className="text-amber-800 font-bold flex items-center gap-2 mb-3">
                      <AlertCircle className="w-5 h-5" />
                      Items Not Available Nearby
                    </h3>
                    <p className="text-amber-700 text-sm mb-4">
                      We couldn't find these items from farmers in your optimized route area.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {routeResult.unfulfilledItems.map(item => (
                        <span key={item.id} className="bg-white text-amber-900 border border-amber-200 px-3 py-1 rounded-lg text-sm font-medium">
                          {item.name} ({item.quantity} {item.unit})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {routeResult && routeResult.error && (
              <div className="bg-red-50 text-red-700 p-6 rounded-3xl border border-red-200 text-center">
                <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <h3 className="text-lg font-bold mb-1">No Routes Found</h3>
                <p>{routeResult.error}</p>
                <button onClick={() => setRouteResult(null)} className="mt-4 text-sm font-bold bg-white px-4 py-2 rounded-full border border-red-200 hover:bg-red-100 transition-colors">
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
