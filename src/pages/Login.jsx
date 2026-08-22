import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ email, password });
      navigate('/farmer/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-forest-50 rounded-xl flex items-center justify-center mb-4">
            <Sprout className="h-8 w-8 text-forest-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome back</h2>
          <p className="text-gray-500">
            {isConfigured ? 'Log in with your Supabase farmer credentials' : 'Log in to manage your farm profile'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-forest-600 focus:ring-forest-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
            </div>
            <div className="text-sm">
              <a href="#" className="font-medium text-forest-600 hover:text-forest-500">Forgot your password?</a>
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
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Don't have a farmer account?{' '}
            <Link to="/register" className="font-medium text-forest-600 hover:text-forest-500">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

