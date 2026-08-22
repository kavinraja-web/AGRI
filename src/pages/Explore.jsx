import { useState } from 'react';
import { Search, Filter, SlidersHorizontal, MapPin } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, categories } from '../data/mockData';

export default function Explore() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.farmerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Fresh Produce</h1>
          <p className="text-gray-600">Discover fresh produce from local farmers around you.</p>
        </div>
        
        <div className="w-full md:w-auto flex gap-2">
          <div className="relative flex-grow md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products or farmers..." 
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
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold text-lg">
              <Filter className="h-5 w-5" />
              Filters
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Categories</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="category" 
                    checked={selectedCategory === 'All'}
                    onChange={() => setSelectedCategory('All')}
                    className="text-forest-600 focus:ring-forest-500 w-4 h-4"
                  />
                  <span className="text-gray-600 group-hover:text-forest-600 transition-colors">All Produce</span>
                </label>
                {categories.map(cat => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === cat}
                      onChange={() => setSelectedCategory(cat)}
                      className="text-forest-600 focus:ring-forest-500 w-4 h-4"
                    />
                    <span className="text-gray-600 group-hover:text-forest-600 transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Max Distance</h3>
              <input type="range" min="5" max="50" defaultValue="25" className="w-full accent-forest-600" />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>5 km</span>
                <span>50+ km</span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Sort By</h3>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-forest-500 outline-none">
                <option>Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Nearest First</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-grow">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your filters or search term to find what you're looking for.</p>
              <button 
                onClick={() => {setSearchTerm(''); setSelectedCategory('All');}}
                className="btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
