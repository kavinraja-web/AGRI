import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Register() {
  const navigate = useNavigate();
  const { sendOtp, verifyOtp } = useAuth();
  const { t } = useLanguage();

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [formData, setFormData] = useState({ name: '', phone: '', farmName: '', location: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await sendOtp({ fullName: formData.name, phone: formData.phone, farmName: formData.farmName, location: formData.location });
      setStep(2);
    } catch (err) {
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
      await verifyOtp({ phone: formData.phone, token: otp });
      navigate('/farmer/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid OTP.');
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
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t('joinTitle')}</h2>
          <p className="text-gray-500">{t('joinSubtitle')}</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form className="mt-8 space-y-6" onSubmit={handleSendOtp}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
                <input
                  id="name" type="text" required value={formData.name} onChange={handleChange}
                  placeholder="e.g. Ravi Kumar"
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">{t('phoneNumber')}</label>
                <input
                  id="phone" type="tel" required value={formData.phone} onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 mb-1">{t('farmName')}</label>
                <input
                  id="farmName" type="text" value={formData.farmName} onChange={handleChange}
                  placeholder="e.g. Green Acres"
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">{t('farmLocation')}</label>
                <input
                  id="location" type="text" required value={formData.location} onChange={handleChange}
                  placeholder="e.g. Kanchipuram, Tamil Nadu"
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                />
              </div>
            </div>

            <div className="flex items-start">
              <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 mt-0.5 text-forest-600 focus:ring-forest-500 border-gray-300 rounded" />
              <label htmlFor="terms" className="ml-3 text-sm font-medium text-gray-700">{t('agreeTerms')}</label>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary text-lg flex justify-center items-center py-3 disabled:opacity-50">
              {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> {t('sendingOtp') || 'Sending OTP...'}</> : (t('sendOtp') || 'Send OTP')}
            </button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerifyOtp}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">{t('otpLabel') || '6-Digit OTP'}</label>
              <input
                id="otp" name="otp" type="text" required maxLength={6}
                value={otp} onChange={(e) => setOtp(e.target.value)}
                className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 text-center tracking-widest font-mono text-xl focus:outline-none focus:ring-forest-500 focus:border-forest-500"
                placeholder="------"
              />
            </div>

            <button type="submit" disabled={loading || otp.length < 6} className="w-full btn-primary text-lg flex justify-center items-center py-3 disabled:opacity-50">
              {loading ? <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> {t('verifying') || 'Verifying...'}</> : (t('verifyCreate') || 'Verify & Create Account')}
            </button>

            <div className="text-center mt-4">
              <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-forest-600 hover:text-forest-500">
                {t('goBack') || 'Go Back'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-medium text-forest-600 hover:text-forest-500">{t('login')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
