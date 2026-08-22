import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Map, Users, ArrowRight } from 'lucide-react';
import { categories } from '../data/mockData';

export default function Landing() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-earth-100 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
                Discover Fresh Produce.<br />
                <span className="text-forest-600">Connect Directly With Farmers.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Explore locally available produce, compare prices and quantities, and connect directly with the farmers who grow it.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link to="/explore" className="btn-primary flex items-center justify-center text-lg px-8 py-4">
                  Explore Produce
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/register" className="btn-secondary text-lg px-8 py-4">
                  List Your Produce
                </Link>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 max-w-xl mx-auto lg:mx-0">
                <p className="text-sm font-medium text-gray-500 mb-3 px-2">What are you looking for?</p>
                <div className="relative flex items-center">
                  <Search className="absolute left-4 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search tomatoes, rice, vegetables..." 
                    className="w-full bg-gray-50 border-none rounded-xl py-3 pl-12 pr-4 text-gray-900 focus:ring-2 focus:ring-forest-500 outline-none"
                  />
                  <Link to="/explore" className="absolute right-2 bg-forest-600 text-white p-2 rounded-lg hover:bg-forest-700 transition-colors">
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 px-2">
                  {categories.slice(0, 5).map(cat => (
                    <Link key={cat} to={`/explore?category=${cat}`} className="text-xs font-medium bg-earth-200 text-gray-700 px-3 py-1.5 rounded-full hover:bg-earth-300 transition-colors">
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-[4/5]">
                <img 
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" 
                  alt="Fresh local produce" 
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>
              </div>
              
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 md:bottom-8 md:-left-12 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-4 animate-bounce" style={{animationDuration: '3s'}}>
                <img src="https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=100" alt="Farmer" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="text-xs text-forest-600 font-bold uppercase tracking-wider">New Harvest</p>
                  <p className="font-bold text-gray-900">Fresh Tomatoes</p>
                  <p className="text-sm text-gray-500">Ravi K. • 18km away</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust / Value Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why choose FarmConnect?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">We're building a transparent ecosystem that benefits both farmers and consumers.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: "Transparent Prices", desc: "See current prices from different farmers before you buy." },
              { icon: Search, title: "Fresh & Available", desc: "Know exactly what's available before contacting a farmer." },
              { icon: Users, title: "Direct Connection", desc: "Connect directly with the people growing your food." },
              { icon: Map, title: "Local Discovery", desc: "Discover farmers and fresh produce right around you." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-earth-100 p-8 rounded-3xl hover:shadow-md transition-shadow">
                <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm mb-6">
                  <feature.icon className="h-7 w-7 text-forest-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW: Natural Fertilizer & Local Livestock Farm Banner */}
      <section className="py-12 bg-earth-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-fresh-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <span className="inline-block bg-amber-400 text-forest-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                FEATURED HUB
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Natural Organic Fertilizers from Local Hen, Goat & Cow Farms
              </h2>
              <p className="text-forest-100 text-base sm:text-lg">
                Stop spending thousands on chemical fertilizers. Buy bio-organic manure (poultry litter, goat pellets, cow dung) directly from nearby livestock farms and save up to 75% while boosting soil health!
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0 w-full sm:w-auto">
              <Link 
                to="/natural-fertilizers" 
                className="bg-amber-400 hover:bg-amber-300 text-forest-900 font-extrabold px-8 py-4 rounded-full text-center transition-all shadow-lg hover:scale-105"
              >
                Explore Natural Fertilizers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-forest-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How it works</h2>
            <p className="text-forest-100 text-lg">Three simple steps to fresh, local produce.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-forest-700/50 -z-10"></div>
            
            {[
              { step: "01", title: "Search Produce", desc: "Browse what's currently available in your area." },
              { step: "02", title: "Compare Farmers", desc: "Review prices, quantities, and farmer profiles." },
              { step: "03", title: "Connect Directly", desc: "Get the farmer's details and contact them directly." }
            ].map((item, idx) => (
              <div key={idx} className="text-center relative">
                <div className="w-24 h-24 mx-auto bg-forest-800 rounded-full flex items-center justify-center mb-6 border-4 border-forest-900 shadow-xl">
                  <span className="text-3xl font-bold text-forest-300">{item.step}</span>
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-forest-100 text-lg max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Link to="/explore" className="inline-block bg-white text-forest-900 px-8 py-4 rounded-full font-bold hover:bg-forest-50 transition-colors">
              Start Exploring Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
