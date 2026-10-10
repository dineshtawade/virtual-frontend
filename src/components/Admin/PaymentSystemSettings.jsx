import React, { useState, useEffect } from 'react';
import {
  Mail,
  CreditCard,
  Key,
  Lock,
  Eye,
  EyeOff,
  Send,
  Save,
  CheckCircle,
  AlertCircle,
  Server,
  ShieldCheck,
  RefreshCw,
  Code2,
} from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function PaymentSystemSettings() {
  const [activeTab, setActiveTab] = useState('smtp');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);

  // Form States
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(587);
  const [smtpUser, setSmtpUser] = useState('globalinfotechindia07@gmail.com');
  const [smtpPass, setSmtpPass] = useState('milp oeru ubrf grtm');
  const [enableOtpEmail, setEnableOtpEmail] = useState(true);
  const [testRecipient, setTestRecipient] = useState('globalinfotechindia07@gmail.com');

  const [provider, setProvider] = useState('razorpay');
  const [razorpayKeyId, setRazorpayKeyId] = useState('rzp_test_9876543210AB');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('sec_test_RazorpayKey9999');
  const [environment, setEnvironment] = useState('test');
  const [currency, setCurrency] = useState('INR');
  const [enableAutoProration, setEnableAutoProration] = useState(true);

  // Visibility toggles
  const [showSmtpPass, setShowSmtpPass] = useState(false);
  const [showRazorpaySecret, setShowRazorpaySecret] = useState(false);

  // Feedback Messages
  const [statusMessage, setStatusMessage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getSettings();
      const isSuccess = res?.success || res?.data?.success;
      const data = res?.data?.data || res?.data || res;

      if (isSuccess && data) {
        if (data.smtp) {
          setSmtpHost(data.smtp.smtpHost || 'smtp.gmail.com');
          setSmtpPort(data.smtp.smtpPort || 587);
          setSmtpUser(data.smtp.smtpUser || 'globalinfotechindia07@gmail.com');
          setSmtpPass(data.smtp.smtpPass || 'milp oeru ubrf grtm');
          setEnableOtpEmail(data.smtp.enableOtpEmail !== false);
          setTestRecipient(data.smtp.smtpUser || 'globalinfotechindia07@gmail.com');
        }
        if (data.paymentGateway) {
          setProvider(data.paymentGateway.provider || 'razorpay');
          setRazorpayKeyId(data.paymentGateway.razorpayKeyId || 'rzp_test_9876543210AB');
          setRazorpayKeySecret(data.paymentGateway.razorpayKeySecret || 'sec_test_RazorpayKey9999');
          setEnvironment(data.paymentGateway.environment || 'test');
          setCurrency(data.paymentGateway.currency || 'INR');
          setEnableAutoProration(data.paymentGateway.enableAutoProration !== false);
        }
      }
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e?.preventDefault();
    setIsSaving(true);
    setStatusMessage(null);

    const payload = {
      smtp: {
        smtpHost,
        smtpPort: Number(smtpPort),
        smtpUser,
        smtpPass,
        enableOtpEmail,
      },
      paymentGateway: {
        provider,
        razorpayKeyId,
        razorpayKeySecret,
        environment,
        currency,
        enableAutoProration,
      },
    };

    try {
      const res = await adminService.updateSettings(payload);
      const isSuccess = res?.success || res?.data?.success;
      const msg = res?.message || res?.data?.message || 'Settings saved successfully!';

      if (isSuccess) {
        setStatusMessage({
          type: 'success',
          text: '🎉 Razorpay API Credentials & System Settings saved successfully!',
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: msg,
        });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || err.response?.data?.message || 'Server error while saving settings.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestEmail = async () => {
    setIsTestingEmail(true);
    setStatusMessage(null);

    try {
      await adminService.updateSettings({
        smtp: {
          smtpHost,
          smtpPort: Number(smtpPort),
          smtpUser,
          smtpPass,
          enableOtpEmail,
        },
      });

      const res = await adminService.testEmail(testRecipient);
      const isSuccess = res?.success || res?.data?.success;
      const msg = res?.message || res?.data?.message || 'Test email completed.';

      if (isSuccess) {
        setStatusMessage({
          type: 'success',
          text: `🎉 ${msg} (Test OTP: ${res?.otpCode || res?.data?.otpCode || '123456'})`,
        });
      } else {
        setStatusMessage({
          type: 'error',
          text: msg,
        });
      }
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: err.message || err.response?.data?.message || 'Failed to send test email.',
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <RefreshCw className="animate-spin text-indigo-600 mr-3" size={24} />
        <span className="text-slate-600 font-medium">Loading System & Payment Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider mb-1">
              <Server size={14} /> Super Admin Control Center
            </div>
            <h2 className="text-xl font-bold tracking-tight">System Settings & Payment Gateway Configuration</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Configure SMTP Mail Transport for OTP verification alerts and Razorpay API credentials for automated subscription payments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {statusMessage.type === 'success' ? (
            <CheckCircle size={18} className="text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
          )}
          <div className="text-xs font-medium">{statusMessage.text}</div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('smtp')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'smtp'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Mail size={15} />
          <span>Email & OTP Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab('payment')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'payment'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <CreditCard size={15} />
          <span>Razorpay Payment Gateway</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'code'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Code2 size={15} />
          <span>Live Nodemailer Transport Preview</span>
        </button>
      </div>

      {/* Tab 1: Email / SMTP Configuration */}
      {activeTab === 'smtp' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Mail size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">SMTP Server & Authentication</h3>
                  <p className="text-xs text-slate-500">Configure Nodemailer settings for OTP emails</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Enable OTP Email</span>
                <button
                  type="button"
                  onClick={() => setEnableOtpEmail(!enableOtpEmail)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    enableOtpEmail ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      enableOtpEmail ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Host</label>
                <div className="relative">
                  <input
                    type="text"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                    placeholder="smtp.gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                  />
                  <Server size={14} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">SMTP Port</label>
                <div className="relative">
                  <input
                    type="number"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                    placeholder="587"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                  />
                  <Lock size={14} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SMTP User (Sender Email Address)
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={smtpUser}
                    onChange={(e) => setSmtpUser(e.target.value)}
                    placeholder="globalinfotechindia07@gmail.com"
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                  <Mail size={14} className="absolute left-3 top-2.5 text-slate-400" />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  SMTP Password / App Password
                </label>
                <div className="relative">
                  <input
                    type={showSmtpPass ? 'text' : 'password'}
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="milp oeru ubrf grtm"
                    className="w-full pl-9 pr-10 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono tracking-wider"
                  />
                  <Key size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowSmtpPass(!showSmtpPass)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showSmtpPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  For Gmail, use a 16-character App Password generated from your Google Account security settings.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">TLS Reject Unauthorized: Disabled (false)</span>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all"
              >
                {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                <span>Save SMTP Config</span>
              </button>
            </div>
          </div>

          {/* Test Email Dispatch Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={16} /> SMTP Test Runner
              </div>
              <h4 className="text-base font-bold">Dispatch Test OTP Email</h4>
              <p className="text-xs text-slate-400 mt-1">
                Trigger a live Nodemailer test email with a random 6-digit OTP code to verify your SMTP setup.
              </p>

              <div className="mt-5 space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Email</label>
                  <input
                    type="email"
                    value={testRecipient}
                    onChange={(e) => setTestRecipient(e.target.value)}
                    placeholder="receiver@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={isTestingEmail}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  {isTestingEmail ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Sending Test OTP Email...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send Test Email Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/50 text-[11px] text-slate-300">
              <span className="font-bold text-amber-400">Current SMTP Sender:</span> {smtpUser}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Razorpay Payment Gateway Configuration */}
      {activeTab === 'payment' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <CreditCard size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Razorpay API Credentials</h3>
                <p className="text-xs text-slate-500">Configure Key ID and Key Secret for subscription checkouts</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-600">Environment Mode</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setEnvironment('test')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    environment === 'test' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  TEST
                </button>
                <button
                  type="button"
                  onClick={() => setEnvironment('live')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    environment === 'live' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600'
                  }`}
                >
                  LIVE
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Razorpay Key ID</label>
              <div className="relative">
                <input
                  type="text"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value)}
                  placeholder="rzp_test_..."
                  className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                />
                <Key size={14} className="absolute left-3 top-3 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Public Key used in frontend checkout widgets.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Razorpay Key Secret</label>
              <div className="relative">
                <input
                  type={showRazorpaySecret ? 'text' : 'password'}
                  value={razorpayKeySecret}
                  onChange={(e) => setRazorpayKeySecret(e.target.value)}
                  placeholder="Key Secret"
                  className="w-full pl-9 pr-10 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
                />
                <Lock size={14} className="absolute left-3 top-3 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowRazorpaySecret(!showRazorpaySecret)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showRazorpaySecret ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Private Secret for backend signature verification.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Default Billing Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium bg-white"
              >
                <option value="INR">INR (₹) - Indian Rupee</option>
                <option value="USD">USD ($) - US Dollar</option>
                <option value="EUR">EUR (€) - Euro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Auto-Proration Policy</label>
              <div className="flex items-center justify-between p-2.5 border border-slate-200 rounded-xl bg-slate-50/50">
                <span className="text-xs text-slate-700 font-medium">Credit unused days on plan upgrades</span>
                <button
                  type="button"
                  onClick={() => setEnableAutoProration(!enableAutoProration)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    enableAutoProration ? 'bg-indigo-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      enableAutoProration ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-slate-600 font-medium">Gateway Status: Ready for Webhook Events</span>
            </div>
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Gateway Settings</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Code Snippet Preview */}
      {activeTab === 'code' && (
        <div className="bg-slate-950 text-slate-100 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
              <Code2 size={16} /> Active Nodemailer Transporter Code Instance
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-mono">
              backend/src/utils/emailService.js
            </span>
          </div>

          <pre className="text-xs text-emerald-400 overflow-x-auto p-4 bg-slate-900 rounded-xl leading-relaxed">
{`const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || '${smtpHost}',
  port: process.env.SMTP_PORT || ${smtpPort},
  secure: false,
  auth: {
    user: process.env.SMTP_USER || '${smtpUser}',
    pass: process.env.SMTP_PASS || '${smtpPass}'
  },
  tls: {
    rejectUnauthorized: false
  }
});`}
          </pre>

          <p className="text-xs text-slate-400 font-sans">
            This exact Nodemailer transport configuration is dynamically instantiated in the backend when sending OTP
            verification codes or subscription invoice alerts to users.
          </p>
        </div>
      )}
    </div>
  );
}
