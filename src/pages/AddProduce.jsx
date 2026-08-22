import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud, ChevronLeft, Loader2, AlertCircle, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createProduct } from '../services/productService';
import { uploadProduceImage } from '../services/storageService';
import { classifyImage } from '../utils/imageClassifier';

export default function AddProduce() {
  const navigate = useNavigate();
  const { user, farmerProfile, isConfigured } = useAuth();
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
      let imageUrl = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=600&h=400';
      
      if (selectedFile) {
        imageUrl = await uploadProduceImage(selectedFile);
      }

      const farmerId = user?.id || farmerProfile?.id || 1;

      await createProduct({
        ...formData,
        farmerId,
        imageUrl
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/farmer/dashboard');
      }, 1200);
    } catch (err) {
      console.error('Failed to create produce listing:', err);
      setError(err.message || 'Failed to publish produce. Please check database permissions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50">
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <Link to="/farmer/dashboard" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-forest-600 mb-6 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>

          <div className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-3xl font-bold text-gray-900">Add New Produce</h1>
              {isConfigured && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Supabase Live DB
                </span>
              )}
            </div>
            <p className="text-gray-500 mb-8">List your fresh produce for local consumers to discover.</p>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <span>Produce successfully published to Supabase! Redirecting...</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  className="hidden" 
                />

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
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className="bg-white text-gray-800 px-4 py-2 rounded-xl text-sm font-semibold shadow hover:bg-gray-50"
                        >
                          Change Image
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
                    <p className="text-gray-900 font-medium mb-1">Click to upload product image</p>
                    <p className="text-gray-500 text-sm mb-4">PNG, JPG, WebP up to 5MB</p>
                    <span className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm shadow-sm inline-flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" /> Choose Image
                    </span>
                  </div>
                )}
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Fresh Red Tomatoes" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" 
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    id="category" 
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500 bg-white"
                  >
                    <option>Vegetables</option>
                    <option>Fruits</option>
                    <option>Grains</option>
                    <option>Spices</option>
                    <option>Dairy</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="harvestDate" className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                  <input 
                    type="date" 
                    id="harvestDate" 
                    value={formData.harvestDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" 
                  />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input 
                    type="number" 
                    id="price" 
                    required 
                    min="0"
                    step="any"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 40" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input 
                      type="number" 
                      id="quantity" 
                      required 
                      min="0"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="100" 
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" 
                    />
                  </div>
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select 
                      id="unit" 
                      value={formData.unit}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500 bg-white"
                    >
                      <option>kg</option>
                      <option>grams</option>
                      <option>pieces</option>
                      <option>bunches</option>
                      <option>liters</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location / Farm Address</label>
                  <input 
                    type="text" 
                    id="location" 
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Kanchipuram, Tamil Nadu" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    id="description" 
                    rows="4" 
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your produce (organic, freshly picked today, sweet variety, etc.)" 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                  ></textarea>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary flex-grow text-lg flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Publishing to Supabase...
                    </>
                  ) : (
                    'Publish Produce'
                  )}
                </button>
                <button 
                  type="button" 
                  onClick={() => navigate('/farmer/dashboard')}
                  className="btn-secondary sm:w-1/3 text-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

