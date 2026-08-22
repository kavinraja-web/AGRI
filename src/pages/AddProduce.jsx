import { Link, useNavigate } from 'react-router-dom';
import { UploadCloud, ChevronLeft } from 'lucide-react';

export default function AddProduce() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/farmer/dashboard');
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Produce</h1>
            <p className="text-gray-500 mb-8">List your fresh produce for local consumers to discover.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Image Upload Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-900 font-medium mb-1">Drag & drop product images here</p>
                  <p className="text-gray-500 text-sm mb-4">or</p>
                  <span className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm shadow-sm inline-block">
                    Upload Images
                  </span>
                  <p className="text-xs text-gray-400 mt-4">High quality images recommended (Max 5MB)</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" id="name" required placeholder="e.g. Fresh Red Tomatoes" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select id="category" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500 bg-white">
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
                  <input type="date" id="harvestDate" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" />
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                  <input type="number" id="price" required placeholder="0.00" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input type="number" id="quantity" required placeholder="100" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" />
                  </div>
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <select id="unit" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500 bg-white">
                      <option>kg</option>
                      <option>grams</option>
                      <option>pieces</option>
                      <option>bunches</option>
                      <option>liters</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location (if different from farm)</label>
                  <input type="text" id="location" placeholder="e.g. Kanchipuram" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea id="description" rows="4" placeholder="Describe your produce (freshness, farming method, etc.)" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"></textarea>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-100">
                <button type="submit" className="btn-primary flex-grow text-lg">
                  Publish Produce
                </button>
                <button type="button" className="btn-secondary sm:w-1/3 text-lg">
                  Save Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
