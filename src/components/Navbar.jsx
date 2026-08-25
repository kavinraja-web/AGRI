import { Link, useLocation } from 'react-router-dom';
import { Sprout, Menu, X, Leaf, Search, User, LogOut, LayoutDashboard, Database, Globe, ChevronDown, ShoppingBasket, BarChart3 } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, farmerProfile, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const location = useLocation();

  const isLoggedIn = user || farmerProfile;
  const path = location.pathname;

  const NavItem = ({ to, label, icon: Icon, badge, active }) => (
    <Link 
      to={to} 
      className={`relative flex items-center gap-1.5 h-20 px-1 font-medium transition-colors ${
        active ? 'text-forest-700' : 'text-gray-700 hover:text-forest-600'
      }`}
    >
      {Icon && <Icon className={`w-4 h-4 ${active ? 'text-forest-700' : 'text-gray-500'}`} />}
      {label}
      {badge && (
        <span className="bg-emerald-50 text-emerald-700 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm tracking-wide ml-1">
          {badge}
        </span>
      )}
      {/* Active Underline */}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-forest-600 rounded-t-full"></div>
      )}
    </Link>
  );

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="text-forest-700 flex items-center justify-center">
                <Sprout className="h-7 w-7 text-forest-700" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">Marudham</span>
                <span className="text-[11px] text-gray-500 font-medium tracking-tight mt-0.5">{t('growBetter')}</span>
              </div>
            </Link>
          </div>
          {/* Desktop Center Nav */}
          <div className="hidden lg:flex items-center space-x-8 text-sm ml-auto mr-8">
            <NavItem to="/" label={t('home')} active={path === '/'} />
            <NavItem to="/explore" label={t('explore')} active={path === '/explore'} />
            <NavItem to="/bucket-list" label={lang === 'ta' ? 'பட்டியல்' : 'Bucket List'} icon={ShoppingBasket} active={path === '/bucket-list'} />
            <NavItem to="/trends" label={lang === 'ta' ? 'போக்கு' : 'Trends'} icon={BarChart3} badge="AI" active={path === '/trends'} />
          </div>

          {/* Desktop Right Side */}
          <div className="hidden lg:flex items-center h-20">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              title={lang === 'en' ? 'Switch to Tamil' : 'Switch to English'}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-colors text-xs font-semibold mr-4"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'தமிழ்' : 'English'}
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isLoggedIn ? (
              <div className="flex items-center h-full">
                {/* Divider */}
                <div className="w-px h-6 bg-gray-200 mx-2"></div>
                
                {/* Dashboard Link */}
                <Link
                  to="/farmer/dashboard"
                  className="flex items-center gap-1.5 text-gray-700 hover:text-forest-600 font-medium transition-colors text-sm px-4"
                >
                  <LayoutDashboard className="h-4 w-4 text-gray-500" />
                  {t('dashboard')}
                </Link>

                {/* Divider */}
                <div className="w-px h-6 bg-gray-200 mx-2"></div>

                {/* User Profile */}
                <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors ml-2">
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-forest-100 flex items-center justify-center text-xs font-bold text-forest-800">
                    {farmerProfile?.image || farmerProfile?.avatar_url ? (
                      <img src={farmerProfile.image || farmerProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-700">
                    {farmerProfile?.name?.split(' ')[0] || farmerProfile?.full_name?.split(' ')[0] || 'Farmer'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>

                {/* Logout Icon */}
                <button
                  onClick={logout}
                  title={t('signOut')}
                  className="text-gray-400 hover:text-gray-900 p-2 ml-2 rounded-lg transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
                <Link to="/login" className="px-4 py-2 text-gray-700 font-semibold text-sm hover:text-forest-600 transition-colors">
                  {t('login')}
                </Link>
                <Link to="/register" className="bg-forest-800 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-forest-900 transition-colors">
                  {t('joinAsFarmer')}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              {lang === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:text-gray-900 p-2">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-lg absolute w-full left-0 animate-[slideDown_0.2s_ease-out]">
          <Link to="/" onClick={() => setIsOpen(false)} className={`block font-medium py-2 ${path === '/' ? 'text-forest-700' : 'text-gray-600'}`}>
            {t('home')}
          </Link>
          <Link to="/explore" onClick={() => setIsOpen(false)} className={`block font-medium py-2 ${path === '/explore' ? 'text-forest-700' : 'text-gray-600'}`}>
            {t('explore')}
          </Link>

          <Link
            to="/bucket-list"
            onClick={() => setIsOpen(false)}
            className={`flex items-center gap-2 font-medium py-2 ${path === '/bucket-list' ? 'text-forest-700' : 'text-gray-600'}`}
          >
            <ShoppingBasket className="w-4 h-4" />
            {lang === 'ta' ? 'பட்டியல்' : 'Bucket List'}
          </Link>

          <Link
            to="/trends"
            onClick={() => setIsOpen(false)}
            className={`flex items-center justify-between font-medium py-2 ${path === '/trends' ? 'text-forest-700' : 'text-gray-600'}`}
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {lang === 'ta' ? 'போக்கு' : 'Trends'}
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-1.5 py-0.5 rounded-sm uppercase">AI</span>
          </Link>

          <hr className="border-gray-100" />

          {isLoggedIn ? (
            <>
              <Link to="/farmer/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-2 text-gray-700 font-medium py-2">
                <LayoutDashboard className="w-4 h-4" /> {t('dashboard')}
              </Link>
              <div className="flex items-center gap-2 py-2 text-gray-700 font-medium">
                 <User className="w-4 h-4" /> {farmerProfile?.name || farmerProfile?.full_name || 'Farmer Profile'}
              </div>
              <button
                onClick={() => { logout(); setIsOpen(false); }}
                className="flex items-center gap-2 w-full text-left text-red-600 font-medium py-2 mt-2"
              >
                <LogOut className="w-4 h-4" /> {t('signOut')}
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-3">
              <Link to="/login" onClick={() => setIsOpen(false)} className="block text-center border border-gray-200 text-gray-700 py-2.5 rounded-lg font-medium">{t('login')}</Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="block text-center bg-forest-800 text-white py-2.5 rounded-lg font-medium">
                {t('joinAsFarmer')}
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
