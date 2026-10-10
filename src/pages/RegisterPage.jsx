import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Building2,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Shield,
  Star,
  ArrowRight,
  X,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { openRazorpayModal } from '../utils/razorpayCheckout';
import { catalogService } from '../services/catalogService';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const planFromUrl = searchParams.get('plan') || 'di_auto_pay';
  const { register, isRegistering } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
    initialPlan: planFromUrl,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);

  const handleOpenSubscriptionModal = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please check and try again.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    // Open Subscription Selection Modal
    setSubscriptionModalOpen(true);
  };

  const handleFinalRegister = async (selectedPlan) => {
    const planKey = selectedPlan || formData.initialPlan;
    const planPrice = planKey === 'combined_auto_pay' ? 2699 : planKey === 'di_auto_pay' ? 1999 : 0;

    const executeRegistration = async (paymentDetails = null) => {
      const finalPayload = {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        password: formData.password,
        initialPlan: planKey,
        paymentDetails,
      };

      setErrorMessage('');
      try {
        const res = await register(finalPayload);
        if (res?.success) {
          setSubscriptionModalOpen(false);
          if (res.data.user?.role === 'superadmin') {
            navigate('/admin');
          } else {
            navigate('/simulator');
          }
        }
      } catch (err) {
        setSubscriptionModalOpen(false);
        setErrorMessage(err.message || 'Registration failed.');
      }
    };

    if (planPrice > 0) {
      // Fetch system settings to obtain Razorpay Key ID set by Super Admin
      let razorpayKey = 'rzp_test_9876543210AB';
      try {
        const catalogRes = await catalogService.getCatalog();
        const gateway = catalogRes?.data?.paymentGateway || catalogRes?.paymentGateway;
        if (gateway?.razorpayKeyId) {
          razorpayKey = gateway.razorpayKeyId;
        }
      } catch (e) {
        console.warn('Using default Razorpay test key:', e);
      }

      const planTitle = planKey === 'combined_auto_pay' ? 'Combined DI + Pro Plus Pack' : 'Direct Inventory Base Plan';

      openRazorpayModal({
        keyId: razorpayKey,
        amount: planPrice,
        planName: planTitle,
        userName: formData.name,
        userEmail: formData.email,
        onSuccess: (paymentInfo) => {
          executeRegistration(paymentInfo);
        },
        onCancel: () => {
          console.log('Razorpay payment dismissed by user.');
        },
      });
    } else {
      executeRegistration();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-blue-500/25">
            <Building2 size={24} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Register Broker Account</h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">Step 1 of 2: Create profile & credentials</p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-rose-700 text-xs font-semibold">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleOpenSubscriptionModal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohan Sharma"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 placeholder:font-normal placeholder:italic transition-all shadow-2xs"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <UserPlus size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Firm / Agency *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Realty"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 placeholder:font-normal placeholder:italic transition-all shadow-2xs"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
                <Building2 size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Work Email *</label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="e.g. rohan@apexrealty.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 placeholder:font-normal placeholder:italic transition-all shadow-2xs"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Shield size={15} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          {/* Password with Eye Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter password (min 6 chars)"
                className="w-full pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 placeholder:font-normal placeholder:italic transition-all shadow-2xs"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <Zap size={15} className="absolute left-3 top-3 text-slate-400" />
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

          {/* Confirm Password with Eye Toggle */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirm Password *</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Re-enter password to confirm"
                className="w-full pl-9 pr-10 py-2.5 text-xs font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 placeholder:font-normal placeholder:italic transition-all shadow-2xs"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <Zap size={15} className="absolute left-3 top-3 text-slate-400" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 transition-colors p-1"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <span>Next: Select Subscription Package</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:underline">
            Sign In here
          </Link>
        </div>
      </div>

      {/* Subscription Package Selection Modal */}
      {subscriptionModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8 space-y-6 border border-slate-200">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-1">
                  <Sparkles size={12} /> Step 2 of 2
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">Select Subscription Package</h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose your starting plan entitlements for {formData.name}</p>
              </div>
              <button
                onClick={() => setSubscriptionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Plan Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Basic Free */}
              <div
                onClick={() => setFormData({ ...formData, initialPlan: 'none' })}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  formData.initialPlan === 'none'
                    ? 'border-blue-600 bg-blue-50/40 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">Starter</span>
                    {formData.initialPlan === 'none' && <CheckCircle2 size={16} className="text-blue-600" />}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Basic Explorer</h4>
                  <div className="my-2">
                    <span className="text-2xl font-extrabold text-slate-900">₹0</span>
                    <span className="text-xs text-slate-500"> / free</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 my-3">
                    <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Explore Simulator</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Manual Upgrade Later</li>
                    <li className="flex items-center gap-1.5 text-slate-400">Locked Inventory Contacts</li>
                  </ul>
                </div>
              </div>

              {/* Option 2: Direct Inventory */}
              <div
                onClick={() => setFormData({ ...formData, initialPlan: 'di_auto_pay' })}
                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  formData.initialPlan === 'di_auto_pay'
                    ? 'border-blue-600 bg-blue-50/40 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">Base Plan</span>
                    {formData.initialPlan === 'di_auto_pay' && <CheckCircle2 size={16} className="text-blue-600" />}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">Direct Inventory (DI)</h4>
                  <div className="my-2">
                    <span className="text-2xl font-extrabold text-slate-900">₹1,999</span>
                    <span className="text-xs text-slate-500"> / month</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 my-3">
                    <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Regular Owner Contacts</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Monthly Auto-Pay</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Pro Plus Add-on Ready</li>
                  </ul>
                </div>
              </div>

              {/* Option 3: Combined Special */}
              <div
                onClick={() => setFormData({ ...formData, initialPlan: 'combined_auto_pay' })}
                className={`p-5 rounded-2xl border-2 relative transition-all cursor-pointer flex flex-col justify-between ${
                  formData.initialPlan === 'combined_auto_pay'
                    ? 'border-indigo-600 bg-indigo-50/40 shadow-md ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-indigo-300'
                }`}
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                  Recommended Bundle
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Combined</span>
                    {formData.initialPlan === 'combined_auto_pay' && <CheckCircle2 size={16} className="text-indigo-600" />}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">DI + Pro Plus Pack</h4>
                  <div className="my-2">
                    <span className="text-2xl font-extrabold text-slate-900">₹2,699</span>
                    <span className="text-xs text-slate-500"> / month</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 my-3">
                    <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> All DI Base Contacts</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> Exclusive Listing Unlocks</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-emerald-500" /> HD Photos Unlocked</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setSubscriptionModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
              >
                Back to Account Details
              </button>

              <button
                type="button"
                disabled={isRegistering}
                onClick={() => handleFinalRegister(formData.initialPlan)}
                className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all"
              >
                <UserPlus size={16} />
                <span>{isRegistering ? 'Completing Registration...' : 'Confirm & Complete Registration'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
