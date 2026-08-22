import { Link } from 'react-router-dom';
import { Sprout, Menu, X, User, LogOut, LayoutDashboard, Database } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, farmerProfile, logout, isConfigured } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-forest-50 p-2 rounded-xl">
                <Sprout className="h-6 w-6 text-forest-600" />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">FarmConnect</span>
            </Link>
            
            {/* Supabase status badge */}
            <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              isConfigured ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
            }`}>
              <Database className="h-3 w-3" />
              {isConfigured ? 'Supabase Live' : 'Demo DB'}
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/explore" className="text-gray-600 hover:text-forest-600 font-medium transition-colors">Explore</Link>
            <Link to="/#how-it-works" className="text-gray-600 hover:text-forest-600 font-medium transition-colors">How it Works</Link>

            {user || farmerProfile ? (
              <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                <Link 
                  to="/farmer/dashboard" 
                  className="flex items-center gap-2 text-gray-700 hover:text-forest-600 font-medium transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4 text-forest-600" />
                  Dashboard
                </Link>

                <div className="flex items-center gap-2 bg-forest-50 py-1.5 px-3 rounded-full border border-forest-100">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-forest-200 flex items-center justify-center text-xs font-bold text-forest-800">
                    {farmerProfile?.image || farmerProfile?.avatar_url ? (
                      <img src={farmerProfile.image || farmerProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-forest-900">
                    {farmerProfile?.name || farmerProfile?.full_name || 'Farmer'}
                  </span>
                </div>

                <button 
                  onClick={logout}
                  title="Sign out"
                  className="text-gray-400 hover:text-red-600 p-2 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-gray-200 pl-6">
                <Link to="/login" className="text-forest-700 font-medium hover:text-forest-800 transition-colors">Login</Link>
                <Link to="/register" className="bg-forest-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-forest-700 transition-all shadow-sm hover:shadow">
                  Join as Farmer
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden gap-2">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4">
          <Link to="/explore" onClick={() => setIsOpen(false)} className="block text-gray-600 font-medium py-2">Explore</Link>
          
          {user || farmerProfile ? (
            <>
              <Link to="/farmer/dashboard" onClick={() => setIsOpen(false)} className="block text-forest-700 font-medium py-2">
                Dashboard ({farmerProfile?.name || 'Farmer'})
              </Link>
              <Link to="/farmer/add-produce" onClick={() => setIsOpen(false)} className="block text-forest-700 font-medium py-2">
                + Add Produce
              </Link>
              <button 
                onClick={() => { logout(); setIsOpen(false); }}
                className="w-full text-left text-red-600 font-medium py-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block text-forest-700 font-medium py-2">Login</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center bg-forest-600 text-white px-5 py-3 rounded-full font-medium mt-2">
                Join as Farmer
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

