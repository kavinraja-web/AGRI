import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { register, isConfigured } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    farmName: '',
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({
        fullName: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
        farmName: formData.farmName,
        location: formData.location
      });
      navigate('/farmer/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || 'Registration failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-forest-50 rounded-xl flex items-center justify-center mb-4">
            <Sprout className="h-8 w-8 text-forest-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Join as a Farmer</h2>
          <p className="text-gray-500">
            {isConfigured ? 'Create your Supabase-powered farmer account.' : 'Join FarmConnect and showcase produce directly.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input 
                id="name" 
                type="text" 
                required 
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Ravi Kumar"
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" 
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input 
                id="phone" 
                type="tel" 
                required 
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" 
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
            <input 
              id="email" 
              type="email" 
              required 
              value={formData.email}
              onChange={handleChange}
              placeholder="ravi@example.com"
              className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" 
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              id="password" 
              type="password" 
              required 
              minLength={6}
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimum 6 characters"
              className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 mb-1">Farm Name (Optional)</label>
              <input 
                id="farmName" 
                type="text" 
                value={formData.farmName}
                onChange={handleChange}
                placeholder="e.g. Green Acres"
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" 
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Farm Location</label>
              <input 
                id="location" 
                type="text" 
                required 
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Kanchipuram, Tamil Nadu" 
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500" 
              />
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-gray-300 rounded" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-700">I agree to the terms and privacy policy.</label>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full btn-primary text-lg flex justify-center items-center py-3 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Creating Account...
              </>
            ) : (
              'Create Farmer Account'
            )}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-forest-600 hover:text-forest-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

