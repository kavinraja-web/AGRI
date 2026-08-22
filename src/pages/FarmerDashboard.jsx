import { Link } from 'react-router-dom';
import { Package, TrendingUp, Users, Eye, Plus, Edit2, AlertCircle } from 'lucide-react';
import { products } from '../data/mockData';

export default function FarmerDashboard() {
  const myProducts = products.filter(p => p.farmerId === 1); // Mocked to Ravi Kumar

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-gray-50">
      {/* Sidebar - desktop */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
        <div className="p-6">
          <div className="space-y-1">
            <Link to="/farmer/dashboard" className="flex items-center px-4 py-3 bg-forest-50 text-forest-700 rounded-xl font-medium">
              Dashboard
            </Link>
            <Link to="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              My Produce
            </Link>
            <Link to="/farmer/add-produce" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              Add Produce
            </Link>
            <Link to="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              Messages
            </Link>
            <Link to="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              Profile
            </Link>
            <Link to="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
              Settings
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Good morning, Ravi 👋</h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your farm today.</p>
            </div>
            <Link to="/farmer/add-produce" className="btn-primary flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Add New Produce
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Active Listings", value: "5", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Total Available", value: "1,240 kg", icon: TrendingUp, color: "text-forest-600", bg: "bg-forest-50" },
              { label: "People Reached", value: "328", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
              { label: "Profile Views", value: "186", icon: Eye, color: "text-orange-600", bg: "bg-orange-50" }
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
              <h2 className="text-xl font-bold text-gray-900">Your Produce</h2>
              <Link to="#" className="text-forest-600 text-sm font-medium hover:text-forest-700">View All</Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-sm">
                    <th className="p-4 font-medium">Product</th>
                    <th className="p-4 font-medium">Price</th>
                    <th className="p-4 font-medium">Stock</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                          <span className="font-bold text-gray-900">{product.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-900">₹{product.price}/{product.unit}</td>
                      <td className="p-4 text-gray-600">{product.quantity} {product.unit}</td>
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
                        <button className="text-gray-400 hover:text-forest-600 transition-colors p-2">
                          <Edit2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {/* Mock extra item */}
                  <tr className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                          <Package className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-gray-900">Green Chillies</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-gray-900">₹40/kg</td>
                    <td className="p-4 text-gray-600">50 kg</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Draft
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-gray-400 hover:text-forest-600 transition-colors p-2">
                        <Edit2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
