import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2,
  LogIn,
  Shield,
  UserCheck,
  Key,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetPlan = searchParams.get('plan');
  const { login, isLoggingIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDemoBroker = () => {
    setEmail('broker@prime-realty.com');
    setPassword('BrokerPassword123!');
  };

  const handleDemoAdmin = () => {
    setEmail('admin@brokersim.com');
    setPassword('AdminPassword123!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const res = await login({ email, password });
      if (res?.success) {
        if (res.data?.user?.role === 'superadmin') {
          navigate('/admin');
        } else if (targetPlan) {
          navigate(`/?checkoutPlan=${targetPlan}`);
        } else {
          navigate('/simulator');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Ambient background glow effects */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white/95 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-2xl p-6 sm:p-8 relative z-10">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-500/25">
            <Building2 size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Sign in to your BrokerSim platform account</p>
        </div>

        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs font-semibold">
            <AlertCircle size={16} className="shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. admin@brokersim.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 placeholder:font-normal placeholder:italic transition-all shadow-2xs"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter account password"
                className="w-full pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 placeholder:font-normal placeholder:italic transition-all shadow-2xs"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition-colors p-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full py-3 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-2 active:scale-95 disabled:opacity-50"
          >
            <LogIn size={16} />
            <span>{isLoggingIn ? 'Signing In...' : 'Sign In to Platform'}</span>
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-bold hover:underline">
            Register new broker
          </Link>
        </div>
      </div>
    </div>
  );
}
