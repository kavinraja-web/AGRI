import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, Users, Eye, Plus, Trash2, AlertCircle, Loader2, Database } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getFarmerProducts, deleteProduct } from '../services/productService';

export default function FarmerDashboard() {
  const { user, farmerProfile, isConfigured } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const farmerId = user?.id || farmerProfile?.id || 1;
  const farmerName = farmerProfile?.name || farmerProfile?.full_name || 'Farmer';

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await getFarmerProducts(farmerId);
        if (mounted) setProducts(data);
      } catch (err) {
        console.error('Failed to load farmer products:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [farmerId]);

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to remove this produce listing?')) return;
    setDeletingId(productId);
    try {
      await deleteProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Could not delete product. ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  // Calculate stats dynamically
  const totalStockKg = products.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
  const activeListings = products.filter(p => p.status === 'Available').length;

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Sidebar - desktop */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <div className="space-y-1">
            <Link to="/farmer/dashboard" className="flex items-center px-4 py-3 bg-forest-50 text-forest-700 rounded-xl font-medium">
              Dashboard
            </Link>
            <Link to="/explore" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              Explore Market
            </Link>
            <Link to="/farmer/add-produce" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              Add Produce
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-gray-900">Good day, {farmerName} 👋</h1>
                {isConfigured && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <Database className="h-3 w-3" /> Supabase
                  </span>
                )}
              </div>
              <p className="text-gray-500 mt-1">Here is what is happening with your farm listings today.</p>
            </div>
            <Link to="/farmer/add-produce" className="btn-primary flex items-center shadow-forest-500/20 shadow-md">
              <Plus className="h-5 w-5 mr-2" />
              Add New Produce
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Active Listings", value: String(activeListings), icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Total Available", value: `${totalStockKg} kg`, icon: TrendingUp, color: "text-forest-600", bg: "bg-forest-50" },
              { label: "People Reached", value: String(farmerProfile?.peopleReached || 120), icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Profile Rating", value: `${farmerProfile?.rating || 4.9} ★`, icon: Eye, color: "text-orange-600", bg: "bg-orange-50" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Your Produce */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Your Produce Listings</h2>
                <p className="text-xs text-gray-400 mt-0.5">Synced with Supabase database</p>
              </div>
              <Link to="/farmer/add-produce" className="text-forest-600 text-sm font-medium hover:text-forest-700">
                + Add Produce
              </Link>
            </div>
            
            {loading ? (
              <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-forest-600 mb-2" />
                <p>Loading your farm produce from database...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <Package className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                <p className="font-semibold text-gray-700">No produce listed yet</p>
                <p className="text-sm mt-1 mb-4">Add your first harvest to start selling to local buyers.</p>
                <Link to="/farmer/add-produce" className="btn-primary inline-flex items-center text-sm">
                  <Plus className="h-4 w-4 mr-1.5" /> Add Produce
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-sm">
                      <th className="p-4 font-medium">Product</th>
                      <th className="p-4 font-medium">Category</th>
                      <th className="p-4 font-medium">Price</th>
                      <th className="p-4 font-medium">Stock</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {products.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                            <div>
                              <Link to={`/product/${product.id}`} className="font-bold text-gray-900 hover:text-forest-600">
                                {product.name}
                              </Link>
                              {product.location && (
                                <p className="text-xs text-gray-400">{product.location}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-sm text-gray-600">{product.category}</td>
                        <td className="p-4 font-medium text-gray-900">₹{product.price}/{product.unit || 'kg'}</td>
                        <td className="p-4 text-gray-600">{product.quantity} {product.unit || 'kg'}</td>
                        <td className="p-4">
                          {product.status === 'Available' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              <AlertCircle className="w-3 h-3 mr-1" />
                              {product.status}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            onClick={() => handleDelete(product.id)}
                            disabled={deletingId === product.id}
                            title="Delete produce"
                            className="text-gray-400 hover:text-red-600 transition-colors p-2 disabled:opacity-50"
                          >
                            {deletingId === product.id ? (
                              <Loader2 className="h-5 w-5 animate-spin text-red-500" />
                            ) : (
                              <Trash2 className="h-5 w-5" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

