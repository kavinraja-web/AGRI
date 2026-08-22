import { Link } from 'react-router-dom';
import { Sprout, Menu, X, Leaf, Search } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="bg-forest-50 p-2 rounded-xl text-forest-700 flex items-center justify-center">
                <Sprout className="h-6 w-6 text-forest-700" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">FarmConnect</span>
                <span className="text-[10px] text-gray-500 font-medium tracking-tight mt-0.5">Grow Better. Together.</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-5 text-sm font-medium">
            <Link to="/" className="flex items-center gap-1 text-gray-700 hover:text-forest-700 transition-colors">
              <span>Home</span>
            </Link>
            <Link to="/explore" className="flex items-center gap-1 text-gray-700 hover:text-forest-700 transition-colors">
              <Search className="w-4 h-4 text-gray-500" />
              <span>Explore</span>
            </Link>
            
            <Link 
              to="/natural-fertilizers" 
              className="inline-flex items-center gap-1.5 bg-forest-50/70 hover:bg-forest-100/70 text-forest-900 font-bold px-4 py-2 rounded-full transition-all border border-forest-200 text-xs shadow-xs"
            >
              <Leaf className="w-3.5 h-3.5 text-forest-700" />
              <span>Natural Fertilizers</span>
              <span className="bg-forest-800 text-white text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded-full tracking-wider">NEW</span>
            </Link>

            <a href="#how-it-works" className="text-gray-700 hover:text-forest-700 transition-colors">How It Works</a>
            <Link to="/login" className="text-gray-700 hover:text-forest-700 transition-colors">For Farmers</Link>
            
            <div className="flex items-center gap-3 pl-4">
              <Link to="/login" className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 font-semibold text-xs hover:bg-gray-50 transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-forest-800 text-white px-5 py-2 rounded-xl text-xs font-semibold hover:bg-forest-900 transition-all shadow-xs flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5" />
                <span>Join as Farmer</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-gray-600 font-medium py-2">Home</Link>
          <Link to="/explore" onClick={() => setIsOpen(false)} className="block text-gray-600 font-medium py-2">Explore</Link>
          <Link 
            to="/natural-fertilizers" 
            onClick={() => setIsOpen(false)} 
            className="flex items-center justify-between bg-forest-50 text-forest-800 font-bold p-3 rounded-xl border border-forest-200"
          >
            <span className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-forest-600" />
              Natural Fertilizers Hub
            </span>
            <span className="bg-amber-400 text-forest-900 text-xs font-extrabold px-2 py-0.5 rounded-full">NEW</span>
          </Link>
          <a href="#how-it-works" onClick={() => setIsOpen(false)} className="block text-gray-600 font-medium py-2">How it Works</a>
          <Link to="/login" onClick={() => setIsOpen(false)} className="block text-gray-600 font-medium py-2">For Farmers</Link>
          <hr className="border-gray-100" />
          <Link to="/login" onClick={() => setIsOpen(false)} className="block text-forest-700 font-medium py-2">Login</Link>
          <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center bg-forest-600 text-white px-5 py-3 rounded-full font-medium mt-2">
            Join as Farmer
          </Link>
        </div>
      )}
    </nav>
  );
}
