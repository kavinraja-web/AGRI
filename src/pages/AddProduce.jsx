import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud, ChevronLeft, Loader2, AlertCircle, CheckCircle, Image as ImageIcon, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { createProduct } from '../services/productService';
import { uploadProduceImage } from '../services/storageService';
import { classifyImage } from '../utils/imageClassifier';

export default function AddProduce() {
  const navigate = useNavigate();
  const { user, farmerProfile, isConfigured } = useAuth();
  const { t } = useLanguage();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Vegetables',
    harvestDate: new Date().toISOString().split('T')[0],
    price: '',
    quantity: '',
    unit: 'kg',
    location: farmerProfile?.location || '',
    description: '',
    status: 'Available'
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          setFormData(prev => ({ ...prev, lat: latitude, lng: longitude }));
          
          // Reverse geocode
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.village || '';
            const district = data.address.county || data.address.state_district || '';
            const state = data.address.state || '';
            const formatted = [city, district, state].filter(Boolean).join(', ');
            setFormData(prev => ({ ...prev, location: formatted }));
          }
        } catch (error) {
          console.error("Error getting location address:", error);
          alert("Failed to get address from coordinates.");
        } finally {
          setGettingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please check permissions.");
        setGettingLocation(false);
      }
    );
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      
      // AI Image Analysis
      setIsAnalyzingImage(true);
      try {
        const result = await classifyImage(file);
        if (result) {
          setFormData(prev => ({
            ...prev,
            name: result.productName,
            category: result.category
          }));
          setError(null);
        } else {
          setError("Failed to analyze image. Please check API key or try a different image.");
        }
      } catch (err) {
        console.error("Error analyzing image:", err);
        setError("AI Error: " + (err.message || "Failed to connect to AI."));
      } finally {
        setIsAnalyzingImage(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let finalLat = formData.lat;
      let finalLng = formData.lng;

      // Automatically convert typed location name into GPS coordinates if missing
      if (!finalLat && !finalLng && formData.location) {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(formData.location)}`);
          const data = await res.json();
          if (data && data.length > 0) {
            finalLat = parseFloat(data[0].lat);
            finalLng = parseFloat(data[0].lon);
          }
        } catch (geoErr) {
          console.warn("Failed to forward geocode typed location:", geoErr);
        }
      }

      let imageUrl = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600&h=400';
      if (selectedFile) {
        imageUrl = await uploadProduceImage(selectedFile);
      }

      const farmerId = user?.id || farmerProfile?.id || 1;
      await createProduct({ ...formData, lat: finalLat, lng: finalLng, farmerId, imageUrl });

      setSuccess(true);
      setTimeout(() => navigate('/farmer/dashboard'), 1200);
    } catch (err) {
      console.error('Failed to create produce listing:', err);
      setError(err.message || 'Failed to publish produce. Please check database permissions.');
    } finally {
      setLoading(false);
    }
  };

  // Category options — value stays in English for DB, label translates
  const categoryOptions = [
    { value: 'Vegetables', labelKey: 'catVegetables' },
    { value: 'Fruits',     labelKey: 'catFruits' },
    { value: 'Grains',     labelKey: 'catGrains' },
    { value: 'Spices',     labelKey: 'catSpices' },
    { value: 'Dairy',      labelKey: 'catDairy' },
    { value: 'Other',      labelKey: 'catOther' },
  ];

  const unitOptions = [
    { value: 'kg',      labelKey: 'unitKg' },
    { value: 'grams',   labelKey: 'unitGrams' },
    { value: 'pieces',  labelKey: 'unitPieces' },
    { value: 'bunches', labelKey: 'unitBunches' },
    { value: 'liters',  labelKey: 'unitLiters' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50">
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/farmer/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-forest-600 mb-6 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t('backToDashboard')}
          </Link>

          <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{t('addProduceTitle')}</h1>
              {isConfigured && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Supabase Live DB
                </span>
              )}
            </div>
            <p className="text-gray-500 mb-8">{t('addProduceSubtitle')}</p>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span>{t('publishedSuccess')}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">{t('uploadBtn')}</label>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

                {imagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-gray-200 group h-64 bg-gray-100">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    {isAnalyzingImage && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                        <Loader2 className="h-8 w-8 animate-spin mb-2" />
                        <span className="font-medium text-sm">AI Analyzing Product...</span>
                      </div>
                    )}
                    
                    {!isAnalyzingImage && (
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-gray-50"
                        >
                          {t('changeImage')}
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-gray-900 font-medium mb-1">{t('uploadImages')}</p>
                    <p className="text-gray-500 text-sm mb-4">{t('uploadImages2')}</p>
                    <span className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm shadow-sm inline-flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" /> {t('uploadBtn')}
                    </span>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('productName')}</label>
                  <input
                    type="text" id="name" required
                    value={formData.name} onChange={handleChange}
                    placeholder={t('productNamePlaceholder')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                  />
                </div>

                {/* Category — translated options */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
                  <select
                    id="category" value={formData.category} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500 bg-white"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                    ))}
                  </select>
                </div>

                {/* Harvest Date */}
                <div>
                  <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700 mb-1">{t('harvestDate')}</label>
                  <input
                    type="date" id="harvestDate"
                    value={formData.harvestDate} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">{t('price')} (₹)</label>
                  <input
                    type="number" id="price" required min="0" step="any"
                    value={formData.price} onChange={handleChange}
                    placeholder="e.g. 40"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                  />
                </div>

                {/* Quantity + Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">{t('quantity')}</label>
                    <input
                      type="number" id="quantity" required min="0"
                      value={formData.quantity} onChange={handleChange}
                      placeholder="100"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">{t('unit')}</label>
                    <select
                      id="unit" value={formData.unit} onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500 bg-white"
                    >
                      {unitOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-1">
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">{t('location')}</label>
                    <button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={gettingLocation}
                      className="text-forest-600 text-sm font-medium flex items-center hover:text-forest-700 disabled:opacity-50"
                    >
                      {gettingLocation ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <MapPin className="w-4 h-4 mr-1" />}
                      Use My Location
                    </button>
                  </div>
                  <input
                    type="text" id="location"
                    value={formData.location} onChange={handleChange}
                    placeholder={t('locationPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">{t('description')}</label>
                  <textarea
                    id="description" rows="4"
                    value={formData.description} onChange={handleChange}
                    placeholder={t('descriptionPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-grow text-lg flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <><Loader2 className="h-5 w-5 mr-2 animate-spin" />{t('publishing')}</>
                  ) : (
                    t('publishProduce')
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/farmer/dashboard')}
                  className="btn-secondary sm:w-1/3 text-lg"
                >
                  {t('saveDraft')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
