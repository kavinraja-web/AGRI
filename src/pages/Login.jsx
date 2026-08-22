import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp, isConfigured } = useAuth();

  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await sendOtp({ phone });
      setStep(2);
    } catch (err) {
      console.error('Failed to send OTP:', err);
      setError(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await verifyOtp({ phone, token: otp });
      navigate('/farmer/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || 'Invalid OTP.');
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
        
        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            <div className="space-y-4">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !phone}
              className="w-full btn-primary text-lg flex justify-center items-center py-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div className="space-y-4">
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">6-Digit OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-center tracking-widest font-mono text-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                  placeholder="------"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || otp.length < 6}
              className="w-full btn-primary text-lg flex justify-center items-center py-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Log in'
              )}
            </button>
            
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="text-sm font-medium text-forest-600 hover:text-forest-500"
              >
                Change Phone Number
              </button>
            </div>
          </form>
        )}
        
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

