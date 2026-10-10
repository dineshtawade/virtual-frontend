import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingBag, Star, Shield, Sparkles, AlertCircle } from 'lucide-react';
import { setActiveTab } from '../../store/emulatorSlice';
import { useEmulatorAction } from '../../hooks/useEmulatorAction';

export default function PricingShop() {
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.emulator.activeTab);
  const { brokerState, featureAccess } = useSelector((state) => state.broker);
  const { executeAction, isExecuting } = useEmulatorAction();

  const di = brokerState?.baseSubscription || {};
  const pro = brokerState?.proPlusAddon || {};

  const formatExpiry = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleAction = async (actionType, payload = {}) => {
    try {
      await executeAction({ actionType, payload });
    } catch (err) {
      console.log('Action failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
          <ShoppingBag size={16} />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Pricing & Subscription Shop</h3>
      </div>

      <div className="p-5 space-y-5">
        {/* Entitlement Status Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-start gap-2.5">
            <div className={`p-1.5 rounded-lg shrink-0 ${featureAccess.isDiActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
              <Shield size={16} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Direct Inventory (DI)</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {featureAccess.isDiActive ? (
                  <span className="text-emerald-600">
                    Active {di.expiresAt ? `until ${formatExpiry(di.expiresAt)}` : ''}
                    {di.autoPayActive && ' (Auto-Pay)'}
                  </span>
                ) : (
                  <span className="text-slate-400">Inactive</span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className={`p-1.5 rounded-lg shrink-0 ${featureAccess.isProPlusActive ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'}`}>
              <Star size={16} />
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pro Plus Add-On</p>
              <p className="text-xs font-bold text-slate-900 mt-0.5">
                {featureAccess.isProPlusActive ? (
                  <span className="text-amber-600">
                    Active {pro.expiresAt ? `until ${formatExpiry(pro.expiresAt)}` : ''}
                    {pro.autoPayActive && (pro.isBundledWithDI ? ' (Bundled Auto-Pay)' : ' (Standalone Auto-Pay)')}
                  </span>
                ) : (
                  <span className="text-slate-400">Inactive</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => dispatch(setActiveTab('owner_subscription'))}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'owner_subscription'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Shield size={15} />
            <span>Owner Subscription (DI)</span>
          </button>

          <button
            onClick={() => dispatch(setActiveTab('addons'))}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'addons'
                ? 'border-blue-600 text-blue-600 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Star size={15} />
            <span>Add-ons → Pro Plus</span>
          </button>
        </div>

        {/* Tab Pane 1: Owner Subscription */}
        {activeTab === 'owner_subscription' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-slate-900">DI Monthly Auto-Pay</h4>
                    <span className="text-xs font-extrabold text-blue-600">₹1,999 / mo</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Recurring monthly subscription for direct owner inventory contact details.</p>
                </div>

                {di.autoPayActive ? (
                  <button
                    disabled={isExecuting}
                    onClick={() => handleAction('CANCEL_DI_AUTO_PAY')}
                    className="w-full py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all"
                  >
                    Cancel DI Auto-Pay
                  </button>
                ) : (
                  <button
                    disabled={isExecuting}
                    onClick={() => handleAction('START_DI_AUTO_PAY')}
                    className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-xs"
                  >
                    Start DI Auto-Pay
                  </button>
                )}
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-slate-900">DI 3-Month One-Time Pack</h4>
                    <span className="text-xs font-extrabold text-purple-600">₹5,499</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Fixed-duration 3-month pack access. No recurring billing.</p>
                </div>

                <button
                  disabled={isExecuting}
                  onClick={() => handleAction('PURCHASE_DI_ONE_TIME', { durationMonths: 3 })}
                  className="w-full py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-all shadow-xs"
                >
                  Purchase 3-Month Pack
                </button>
              </div>
            </div>

            {/* Bundled Banner */}
            {!featureAccess.isDiActive && (
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-600" />
                  <h4 className="text-xs font-bold text-amber-900">New Subscriber Special Bundle</h4>
                </div>
                <p className="text-[11px] text-amber-800">Buy Direct Inventory + Pro Plus together in one combined subscription for ₹2,699/mo (Save 15%).</p>
                <button
                  disabled={isExecuting}
                  onClick={() => handleAction('NEW_SUBSCRIBER_BUNDLED_CHECKOUT')}
                  className="px-4 py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-lg transition-all shadow-xs"
                >
                  Buy Bundled DI + Pro Plus Auto-Pay
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab Pane 2: Add-ons -> Pro Plus */}
        {activeTab === 'addons' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-slate-900">Pro Plus 1-Month Pack</h4>
                    <span className="text-xs font-extrabold text-purple-600">₹1,199</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Fixed 1-month Pro Plus pack. Subject to DI expiry cap.</p>
                </div>

                <button
                  disabled={isExecuting}
                  onClick={() => handleAction('PURCHASE_PRO_PLUS_ONE_TIME', { durationMonths: 1 })}
                  className="w-full py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-all shadow-xs"
                >
                  Purchase Pro Plus Pack
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="text-xs font-bold text-slate-900">Standalone Pro Plus Auto-Pay</h4>
                    <span className="text-xs font-extrabold text-amber-600">₹999 / mo</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Recurring monthly Pro Plus add-on subscription.</p>
                </div>

                {pro.autoPayActive && !pro.isBundledWithDI ? (
                  <button
                    disabled={isExecuting}
                    onClick={() => handleAction('CANCEL_PRO_PLUS_AUTO_PAY')}
                    className="w-full py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-all"
                  >
                    Cancel Standalone Pro Plus
                  </button>
                ) : (
                  <button
                    disabled={isExecuting}
                    onClick={() => handleAction('START_STANDALONE_PRO_PLUS_AUTO_PAY')}
                    className="w-full py-2 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-lg transition-all shadow-xs"
                  >
                    Start Standalone Pro Plus
                  </button>
                )}
              </div>

              {/* Bundle Upgrade */}
              {di.autoPayActive && !pro.isBundledWithDI && (
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-3 flex flex-col justify-between sm:col-span-2">
                  <div>
                    <h4 className="text-xs font-bold text-indigo-900">Bundle Upgrade to Combined Auto-Pay (₹2,699/mo)</h4>
                    <p className="text-[11px] text-indigo-700 mt-1">Switch existing DI auto-pay to combined DI + Pro Plus. Pay prorated Pro Plus today.</p>
                  </div>
                  <button
                    disabled={isExecuting}
                    onClick={() => handleAction('BUNDLE_UPGRADE', { proPlusMonthlyPrice: 999 })}
                    className="w-full py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-all shadow-xs"
                  >
                    Upgrade to Combined Auto-Pay
                  </button>
                </div>
              )}

              {/* Align Auto-Pay */}
              {di.accessSource === 'one_time' && !pro.isBundledWithDI && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3 flex flex-col justify-between sm:col-span-2">
                  <div>
                    <h4 className="text-xs font-bold text-blue-900">Align Pro Plus Auto-Pay to DI Expiry</h4>
                    <p className="text-[11px] text-blue-700 mt-1">Prorate Pro Plus until DI expiry date, then start combined recurring auto-pay.</p>
                  </div>
                  <button
                    disabled={isExecuting}
                    onClick={() => handleAction('ALIGN_AUTO_PAY', { proPlusMonthlyPrice: 999 })}
                    className="w-full py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-xs"
                  >
                    Align Pro Plus Auto-Pay
                  </button>
                </div>
              )}
            </div>

            {pro.isBundledWithDI && pro.autoPayActive && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-2 text-blue-800 text-xs font-semibold">
                <AlertCircle size={16} />
                <span>Pro Plus is bundled with Direct Inventory. To cancel, manage via Owner Subscription tab.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
