import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Building2, Key, Star, Image as ImageIcon, Lock, Check, Phone, RefreshCw, Sparkles, Tag } from 'lucide-react';
import { useEmulatorAction } from '../../hooks/useEmulatorAction';
import { propertyService } from '../../services/propertyService';

export default function MockInventory() {
  const { featureAccess, baseSubscription, proPlusAddon } = useSelector((state) => state.broker);
  const { executeAction } = useEmulatorAction();

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unlockedMap, setUnlockedMap] = useState({});
  const [photoModalOpen, setPhotoModalOpen] = useState(false);
  const [activePhotoUrl, setActivePhotoUrl] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
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
      console.error('Failed to load live properties:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnlockProperty = async (prop) => {
    const planTier = prop.planAccess || (prop.isFree ? 'free' : prop.isExclusive || prop.type === 'exclusive' || prop.type === 'pro' ? 'pro' : 'base');
    const actionType = planTier === 'pro' ? 'UNLOCK_EXCLUSIVE_LISTING' : 'UNLOCK_REGULAR_LISTING';

    try {
      const res = await executeAction({
        actionType,
        payload: { listingId: prop.id, title: prop.title, planTier },
      });

      if (res?.success) {
        setUnlockedMap((prev) => ({ ...prev, [prop.id]: true }));
      }
    } catch (err) {
      console.log('Unlock action failed:', err);
    }
  };

  const handleOpenFullPhoto = async (photoUrl) => {
    try {
      const res = await executeAction({ actionType: 'OPEN_FULL_PHOTO', payload: { photoUrl } });
      if (res?.success) {
        setActivePhotoUrl(photoUrl);
        setPhotoModalOpen(true);
      }
    } catch (err) {
      console.log('Photo preview failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <Building2 size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Broker App Inventory Feed</h3>
            <p className="text-[11px] text-slate-500">Live properties posted by Super Admin</p>
          </div>
        </div>

        <button
          onClick={fetchProperties}
          disabled={isLoading}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-all"
          title="Refresh Properties"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="p-5 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center p-8 text-xs text-slate-500">
            <RefreshCw className="animate-spin mr-2 text-blue-600" size={16} />
            Loading real estate inventory...
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center p-6 text-xs text-slate-500">No properties posted yet by Super Admin.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {properties.map((prop) => {
              const planTier = prop.planAccess || (prop.isFree ? 'free' : prop.isExclusive || prop.type === 'exclusive' || prop.type === 'pro' ? 'pro' : 'base');
              const isUnlocked = planTier === 'free' || unlockedMap[prop.id];

              return (
                <div
                  key={prop.id}
                  className={`rounded-2xl border overflow-hidden bg-white shadow-xs transition-all flex flex-col justify-between ${
                    planTier === 'pro'
                      ? 'border-amber-300 ring-1 ring-amber-200/60'
                      : planTier === 'free'
                      ? 'border-emerald-300 ring-1 ring-emerald-200/60'
                      : 'border-slate-200'
                  }`}
                >
                  <div>
                    <div className="relative h-36 bg-slate-100 overflow-hidden">
                      <img
                        src={prop.thumbnail || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80'}
                        alt={prop.title}
                        className="w-full h-full object-cover"
                      />

                      {planTier === 'free' ? (
                        <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-xs">
                          <Sparkles size={10} /> Free Plan Listing
                        </span>
                      ) : planTier === 'pro' ? (
                        <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-xs">
                          <Star size={10} /> Pro Plan Exclusive
                        </span>
                      ) : (
                        <span className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-600 text-white shadow-xs">
                          <Tag size={10} /> Base Plan Listing
                        </span>
                      )}

                      <div className="absolute bottom-2 right-2">
                        <button
                          onClick={() =>
                            handleOpenFullPhoto(
                              Array.isArray(prop.fullPhotos) && prop.fullPhotos.length > 0
                                ? prop.fullPhotos[0]
                                : prop.thumbnail
                            )
                          }
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/75 backdrop-blur-md text-white border border-white/20 hover:bg-black transition-all"
                        >
                          <ImageIcon size={12} />
                          <span>HD Photos</span>
                          {!featureAccess.canViewFullPhotos && <Lock size={10} className="text-amber-400" />}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug">{prop.title}</h4>
                          <span className="text-xs font-extrabold text-blue-600 shrink-0">{prop.price}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{prop.location}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                        {isUnlocked ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600">
                              <Check size={14} /> Contact Unlocked {planTier === 'free' && '(Free Plan)'}
                            </div>
                            <p className="text-xs font-extrabold text-slate-900">{prop.ownerName}</p>
                            <p className="text-xs font-semibold text-blue-600 flex items-center gap-1 font-mono">
                              <Phone size={12} /> {prop.ownerContact}
                            </p>
                          </div>
                        ) : (
                          <div className="text-center space-y-2">
                            <p className="text-[10px] text-slate-500 font-medium">
                              {planTier === 'pro'
                                ? 'Requires DI + Pro Plus Access'
                                : 'Requires Direct Inventory Access'}
                            </p>
                            <button
                              onClick={() => handleUnlockProperty(prop)}
                              className={`w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold text-white transition-all shadow-xs ${
                                planTier === 'pro' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-600 hover:bg-blue-700'
                              }`}
                            >
                              <Key size={13} />
                              <span>Unlock Owner Contact</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Full Photo Modal */}
      {photoModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPhotoModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900">Full-Resolution Listing Photo (Pro Plus Unlocked)</h4>
              <button onClick={() => setPhotoModalOpen(false)} className="text-slate-400 hover:text-slate-700 text-lg font-bold">
                ×
              </button>
            </div>
            <div className="rounded-xl overflow-hidden bg-slate-100 max-h-[70vh] flex items-center justify-center">
              <img src={activePhotoUrl} alt="Full Resolution" className="max-h-[65vh] w-auto object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
