import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Shield,
  Star,
  Smartphone,
  ArrowRight,
  Zap,
  Building2,
  Sparkles,
  CheckCircle2,
  Check,
  Tag,
  Clock,
  HelpCircle,
  ChevronDown,
  Layers,
  Lock,
  Phone,
  Eye,
  MapPin,
  RefreshCw,
  User,
  Key,
  LogIn,
  Sliders,
} from 'lucide-react';
import { propertyService } from '../services/propertyService';
import { catalogService } from '../services/catalogService';
import { emulatorService } from '../services/emulatorService';
import { openRazorpayModal } from '../utils/razorpayCheckout';
import { useAuth } from '../hooks/useAuth';

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated } = useAuth();
  const brokerStore = useSelector((state) => state.broker);
  const liveBrokerState = brokerStore?.brokerState;

  const [openFaq, setOpenFaq] = useState(null);
  const [properties, setProperties] = useState([]);
  const [isLoadingProps, setIsLoadingProps] = useState(true);
  const [activeFilter, setActiveFilter] = useState('auto'); // 'auto' | 'free' | 'all'

  // Determine active user subscription status
  const isDiActive = liveBrokerState?.baseSubscription?.active || user?.brokerState?.baseSubscription?.active;
  const isProPlusActive = liveBrokerState?.proPlusAddon?.active || user?.brokerState?.proPlusAddon?.active;

  useEffect(() => {
    fetchLiveProperties();
    const checkoutPlanParam = searchParams.get('checkoutPlan');
    if (checkoutPlanParam && isAuthenticated) {
      handleSelectPlan(checkoutPlanParam);
    }
  }, [isAuthenticated]);

  const fetchLiveProperties = async () => {
    setIsLoadingProps(true);
    try {
      const res = await propertyService.getProperties();
      const propsList = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
      setProperties(propsList);
    } catch (err) {
      console.error('Failed to load landing page properties:', err);
    } finally {
      setIsLoadingProps(false);
    }
  };

  const plans = [
    {
      id: 'di_auto_pay_monthly',
      name: 'Direct Inventory Base Plan',
      tagline: 'Essential access to direct owner property inventory',
      price: '₹1,999',
      period: '/ month',
      category: 'DI_AUTO_PAY',
      badge: 'Base Subscription',
      isPopular: false,
      features: [
        'Unlock Regular Owner Contacts',
        'Direct Owner Phone & Name Access',
        'Auto-Pay Monthly Billing',
        'Up to 50 Daily Contact Unlocks',
        'Pro Plus Add-On Ready',
      ],
      ctaText: 'Start Base DI Plan',
      ctaColor: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    {
      id: 'combined_di_pro_plus_auto_pay',
      name: 'Combined DI + Pro Plus Pack',
      tagline: 'Complete all-in-one bundle for high-performing brokers',
      price: '₹2,699',
      period: '/ month',
      category: 'COMBINED_AUTO_PAY',
      badge: 'Best Value Bundle (Save 15%)',
      isPopular: true,
      features: [
        'Unlock Regular Owner Contacts',
        'Unlock Exclusive Prime Listings',
        'Full HD Photo Gallery Access',
        'Unlimited Daily Unlocks (999/day)',
        'Priority Customer Support',
        'Prorated Upgrade Protection',
      ],
      ctaText: 'Get Combined Bundle',
      ctaColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25',
    },
    {
      id: 'di_one_time_quarterly',
      name: 'Direct Inventory 3-Month Pass',
      tagline: 'Fixed-duration pack with zero recurring commitment',
      price: '₹5,499',
      period: '/ 3 months',
      category: 'DI_ONE_TIME',
      badge: 'Fixed 90-Day Pack',
      isPopular: false,
      features: [
        'Unlock Regular Owner Contacts',
        'Fixed 90 Days Full Access',
        'No Credit Card Auto-Renew',
        'Capped Pro Plus Add-On Ready',
        'Pay Once, Use Anytime',
      ],
      ctaText: 'Buy 3-Month Pack',
      ctaColor: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
    {
      id: 'pro_plus_auto_pay_monthly',
      name: 'Pro Plus Standalone Add-On',
      tagline: 'Exclusive inventory upgrade for existing DI subscribers',
      price: '₹999',
      period: '/ month',
      category: 'PRO_PLUS_AUTO_PAY',
      badge: 'Add-On SKU',
      isPopular: false,
      features: [
        'Unlock Exclusive Prime Properties',
        'Full HD Photo Gallery Unlocked',
        'Requires Active DI Base Plan',
        'Auto-Pay Monthly Billing',
        'Cancel Standalone Anytime',
      ],
      ctaText: 'Add Pro Plus Upgrade',
      ctaColor: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
  ];

  const faqs = [
    {
      question: 'What is the difference between Direct Inventory (DI) and Pro Plus?',
      answer:
        'Direct Inventory (DI) is our base subscription required to unlock regular owner contact details. Pro Plus is a premium add-on built on top of DI that unlocks exclusive prime listings and full-resolution HD photo galleries.',
    },
    {
      question: 'Can I purchase Pro Plus without a Direct Inventory base plan?',
      answer:
        'No. Pro Plus requires an active Direct Inventory base subscription. If you do not have DI, you can purchase our Combined DI + Pro Plus Pack in a single bundled checkout.',
    },
    {
      question: 'How do bundle upgrades and proration work?',
      answer:
        'When upgrading from DI Auto-Pay to the Combined Pack, your existing DI subscription is upgraded seamlessly. You only pay the prorated Pro Plus amount for the remaining days of your current cycle, and full combined billing starts on your next billing date.',
    },
    {
      question: 'What happens if my Pro Plus one-time pack duration exceeds my DI expiry date?',
      answer:
        'Our system automatically caps Pro Plus one-time access to match your Direct Inventory expiry date so you never pay for add-on access when your base subscription is inactive.',
    },
  ];

  const handleSelectPlan = async (planId) => {
    if (!isAuthenticated) {
      navigate(`/login?plan=${planId}`);
      return;
    }

    const actionMap = {
      di_auto_pay_monthly: 'START_DI_AUTO_PAY',
      combined_di_pro_plus_auto_pay: 'START_DI_AUTO_PAY',
      di_one_time_quarterly: 'PURCHASE_DI_ONE_TIME',
      pro_plus_auto_pay_monthly: 'START_PRO_PLUS_AUTO_PAY',
    };

    const selectedPlanObj = plans.find((p) => p.id === planId);
    const amountVal = selectedPlanObj ? parseInt(selectedPlanObj.price.replace(/[^\d]/g, ''), 10) : 1999;
    const actionType = actionMap[planId] || 'START_DI_AUTO_PAY';

    let razorpayKey = 'rzp_test_9876543210AB';
    try {
      const catalogRes = await catalogService.getCatalog();
      const gateway = catalogRes?.data?.paymentGateway || catalogRes?.paymentGateway;
      if (gateway?.razorpayKeyId) {
        razorpayKey = gateway.razorpayKeyId;
      }
    } catch (e) {
      console.warn('Using fallback test key:', e);
    }

    openRazorpayModal({
      keyId: razorpayKey,
      amount: amountVal,
      planName: selectedPlanObj?.name || 'Subscription Package',
      userName: user?.name || 'Broker User',
      userEmail: user?.email || 'broker@prime-realty.com',
      onSuccess: async (paymentInfo) => {
        try {
          if (planId === 'combined_di_pro_plus_auto_pay') {
            await emulatorService.executeAction('START_DI_AUTO_PAY', { paymentId: paymentInfo.razorpay_payment_id });
            await emulatorService.executeAction('START_PRO_PLUS_AUTO_PAY', { paymentId: paymentInfo.razorpay_payment_id });
          } else {
            await emulatorService.executeAction(actionType, { paymentId: paymentInfo.razorpay_payment_id });
          }
          alert(`🎉 Payment Successful (${paymentInfo.razorpay_payment_id})!\nSubscription "${selectedPlanObj?.name || 'Package'}" is now active on your account.`);
          window.location.href = '/';
        } catch (err) {
          console.error('Failed to update subscription state:', err);
          window.location.reload();
        }
      },
      onCancel: () => {
        console.log('Payment dismissed.');
      },
    });
  };

  // Filter properties based on user login & selected filter
  const displayedProperties = properties.filter((prop) => {
    const targetPlans = Array.isArray(prop.targetPlans)
      ? prop.targetPlans
      : [prop.planAccess || prop.type || 'base'];

    const isFreeProp = targetPlans.includes('free') || prop.isFree || prop.planAccess === 'free';

    if (activeFilter === 'free') {
      return isFreeProp;
    }

    if (!isAuthenticated && activeFilter === 'auto') {
      // For guest users, prioritize Free Plan properties
      return isFreeProp;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Landing Navbar with Glassmorphism */}
      <nav className="h-18 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0"
          >
            <Building2 size={22} />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-none">BrokerSim Engine</h1>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">Direct Inventory & Pro Plus Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">
                Welcome, {user?.name || 'Broker'} ({isProPlusActive ? 'Pro Plan' : isDiActive ? 'Base Plan' : 'Free User'})
              </span>
              {user?.role === 'superadmin' && (
                <Link
                  to="/admin"
                  className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-xs"
                >
                  Admin Portal
                </Link>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 sm:px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
              >
                Sign In
              </Link>

              <Link
                to="/register"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-sm shadow-blue-500/20 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 text-center max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold mb-6 shadow-xs">
          <Sparkles size={14} className="text-indigo-600" />
          <span>Real Estate Broker Subscription & Add-On Engine</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
          Unlock Direct Owner Contacts & Exclusive Prime Listings
        </h1>

        <p className="text-sm sm:text-lg text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed">
          Empowering real estate brokers with instant access to verified owner inventory, exclusive luxury property unlocks, HD photo galleries, and flexible auto-pay or one-time plans.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/register"
            className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-95"
          >
            <span>Choose Subscription Plan</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Feature Badges Bar */}
        <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span>Verified Owner Contacts</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span>Exclusive Prime Listings</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span>Full HD Gallery Access</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
            <span>Automated Prorated Upgrades</span>
          </div>
        </div>
      </section>

      {/* DYNAMIC SUPER ADMIN PROPERTY INVENTORY SHOWCASE (Gated by Subscription Plan) */}
      <section className="py-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 text-xs font-bold mb-2">
              <Building2 size={14} /> Real-Time Property Feed
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Super Admin Property Postings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {!isAuthenticated
                ? '🔒 Guest Mode: Showing Free Plan properties. Log in or Subscribe to access Base & Pro Plan listings.'
                : `Logged in as ${user?.name || 'Broker'} (${isProPlusActive ? '⭐ Pro Plan Active' : isDiActive ? '🔵 Base Plan Active' : '🟢 Free Plan'}).`}
            </p>
          </div>

          {/* Filter Toggle Buttons */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setActiveFilter('auto')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'auto'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {!isAuthenticated ? 'Free Properties (Guest View)' : 'My Plan Feed'}
            </button>

            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              All Properties Preview
            </button>
          </div>
        </div>

        {isLoadingProps ? (
          <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200">
            <RefreshCw className="animate-spin text-blue-600 mr-3" size={20} />
            <span className="text-xs font-semibold text-slate-600">Loading Live Inventory Feed...</span>
          </div>
        ) : displayedProperties.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 space-y-2">
            <p className="font-bold text-slate-700">No properties available under this filter.</p>
            <p>Super Admin has not posted properties for this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProperties.map((prop) => {
              const targetPlans = Array.isArray(prop.targetPlans)
                ? prop.targetPlans
                : [prop.planAccess || prop.type || 'base'];

              const isFreeProp = targetPlans.includes('free') || prop.isFree || prop.planAccess === 'free';
              const isBaseProp = targetPlans.includes('base') || prop.planAccess === 'base';
              const isProProp = targetPlans.includes('pro') || prop.isExclusive || prop.planAccess === 'pro';

              // Access Logic based on User Subscription:
              let isContactUnlocked = false;
              let requiredPlanLabel = '';

              if (isFreeProp) {
                isContactUnlocked = true;
              } else if (isAuthenticated) {
                if (isProProp && isProPlusActive) {
                  isContactUnlocked = true;
                } else if (isBaseProp && (isDiActive || isProPlusActive)) {
                  isContactUnlocked = true;
                }
              }

              if (!isContactUnlocked) {
                if (isProProp) requiredPlanLabel = 'Pro Plan (Pro Plus / Exclusive)';
                else if (isBaseProp) requiredPlanLabel = 'Base Plan (Direct Inventory)';
              }

              return (
                <div
                  key={prop.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between ${
                    isProProp
                      ? 'border-amber-300 ring-1 ring-amber-200/60'
                      : isFreeProp
                      ? 'border-emerald-300 ring-1 ring-emerald-200/60'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="relative h-48 bg-slate-100 overflow-hidden">
                      <img src={prop.thumbnail} alt={prop.title} className="w-full h-full object-cover" />

                      <div className="absolute top-3 left-3 flex flex-wrap gap-1">
                        {isFreeProp && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-md">
                            <Sparkles size={11} /> Free Plan
                          </span>
                        )}
                        {isBaseProp && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-md">
                            <Tag size={11} /> Base Plan
                          </span>
                        )}
                        {isProProp && (
                          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-md">
                            <Star size={11} /> Pro Plan
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-extrabold px-3 py-1 rounded-lg">
                        {prop.price}
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">{prop.title}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <MapPin size={13} className="text-slate-400 shrink-0" />
                          <span className="truncate">{prop.location}</span>
                        </p>
                      </div>

                      {/* Specs Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">{prop.bhk || '3 BHK'}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">{prop.bathrooms || '2'} Baths</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">{prop.carpetArea || '1,200 sq.ft'}</span>
                      </div>

                      {/* Contact & Lock Status Box */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                        {isContactUnlocked ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                              <CheckCircle2 size={14} /> Contact Unlocked {isFreeProp ? '(Free Plan)' : '(Subscriber Access)'}
                            </div>
                            <p className="text-xs font-extrabold text-slate-900">{prop.ownerName}</p>
                            <p className="text-xs font-semibold text-blue-600 font-mono flex items-center gap-1">
                              <Phone size={12} /> {prop.ownerContact}
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                              <Lock size={13} className="text-amber-500" />
                              <span>Requires {requiredPlanLabel}</span>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {!isAuthenticated
                                ? 'Sign in or Subscribe to unlock direct owner contact number.'
                                : `Upgrade your subscription plan to access this ${requiredPlanLabel} listing.`}
                            </p>
                          </div>
                        )}
                      </div>

                      {prop.description && (
                        <p className="text-[11px] text-slate-600 italic line-clamp-2">{prop.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Access: {isContactUnlocked ? 'Unlocked' : 'Locked'}
                    </span>

                    {isContactUnlocked ? (
                      <span className="text-xs font-extrabold text-emerald-600 flex items-center gap-1">
                        <Check size={14} /> Contact Ready
                      </span>
                    ) : !isAuthenticated ? (
                      <Link
                        to="/login"
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-xs flex items-center gap-1"
                      >
                        <LogIn size={13} />
                        <span>Sign In to Unlock</span>
                      </Link>
                    ) : isProProp ? (
                      <button
                        onClick={() => handleSelectPlan('combined_di_pro_plus_auto_pay')}
                        className="px-3.5 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-lg transition-all shadow-xs"
                      >
                        Upgrade Pro Plan
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSelectPlan('di_auto_pay_monthly')}
                        className="px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-xs"
                      >
                        Subscribe Base Plan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* SUBSCRIPTION PLANS SECTION */}
      <section id="plans" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto border-t border-slate-200">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold mb-3">
            <Tag size={14} /> Transparent & Flexible Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Subscription Plans & Pricing SKUs
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Select a subscription plan below to get started immediately.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-3xl border p-6 flex flex-col justify-between transition-all relative ${
                plan.isPopular
                  ? 'border-indigo-500 shadow-xl ring-2 ring-indigo-500/20 scale-105 z-10'
                  : 'border-slate-200 shadow-xs hover:shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md">
                  Most Popular Bundle
                </div>
              )}

              <div>
                <div className="mb-4">
                  <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-2.5 py-1 rounded-md">
                    {plan.badge}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-2.5">{plan.name}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="my-5 pb-5 border-b border-slate-100 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{plan.price}</span>
                  <span className="text-xs font-semibold text-slate-500">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <Check size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-xs ${plan.ctaColor}`}
              >
                {plan.ctaText}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) Section */}
      <section className="py-16 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Everything you need to know about plans and access rules.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-900"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  size={18}
                  className={`text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                />
              </button>

              {openFaq === index && (
                <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-200 bg-white text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© 2026 BrokerSim Product Engine. All rights reserved.</p>
          <div className="flex gap-6 font-medium text-slate-600">
            <Link to="/login" className="hover:text-blue-600">Admin Login</Link>
            <Link to="/register" className="hover:text-blue-600">Register Broker</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
