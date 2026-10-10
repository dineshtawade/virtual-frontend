import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Plus,
  Trash2,
  Edit3,
  Star,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Phone,
  User,
  MapPin,
  Tag,
  ImageIcon,
  Sparkles,
  Search,
  CheckSquare,
  Square,
  Sliders,
  X,
  ExternalLink,
  ShieldCheck,
  Home,
  Check,
} from 'lucide-react';
import { propertyService } from '../../services/propertyService';

export default function SuperAdminPropertyManager() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Toast State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (title, text, type = 'success', showLandingLink = false) => {
    setToast({ title, text, type, showLandingLink });
    setTimeout(() => {
      setToast(null);
    }, 6000);
  };

  // Form Fields State
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    category: 'Apartment',
    targetPlans: ['base'], // Array: ['free', 'base', 'pro']
    bhk: '3 BHK',
    bathrooms: '2',
    carpetArea: '1,200 sq.ft',
    furnishing: 'Semi-Furnished',
    ownerName: '',
    ownerContact: '',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
    fullPhotos: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=90',
    description: '',
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const res = await propertyService.getProperties();
      // Handle both unwrapped and standard Axios response structures cleanly
      const propsList = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.data?.data)
        ? res.data.data
        : [];
      setProperties(propsList);
    } catch (err) {
      console.error('Failed to fetch properties:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingId(null);
    setFormData({
      title: '',
      location: '',
      price: '',
      category: 'Apartment',
      targetPlans: ['base'],
      bhk: '3 BHK',
      bathrooms: '2',
      carpetArea: '1,200 sq.ft',
      furnishing: 'Semi-Furnished',
      ownerName: '',
      ownerContact: '',
      thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
      fullPhotos: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=90',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prop) => {
    setEditingId(prop.id);
    const existingPlans = Array.isArray(prop.targetPlans) && prop.targetPlans.length > 0
      ? prop.targetPlans
      : [prop.planAccess || prop.type || 'base'];

    setFormData({
      title: prop.title || '',
      location: prop.location || '',
      price: prop.price || '',
      category: prop.category || 'Apartment',
      targetPlans: existingPlans,
      bhk: prop.bhk || '3 BHK',
      bathrooms: prop.bathrooms || '2',
      carpetArea: prop.carpetArea || '1,200 sq.ft',
      furnishing: prop.furnishing || 'Semi-Furnished',
      ownerName: prop.ownerName || '',
      ownerContact: prop.ownerContact || '',
      thumbnail: prop.thumbnail || '',
      fullPhotos: Array.isArray(prop.fullPhotos) ? prop.fullPhotos.join(', ') : prop.fullPhotos || '',
      description: prop.description || '',
    });
    setIsModalOpen(true);
  };

  const handleTogglePlanCheckbox = (planKey) => {
    const current = [...formData.targetPlans];
    if (current.includes(planKey)) {
      if (current.length === 1) return; // Must select at least 1 plan
      setFormData({ ...formData, targetPlans: current.filter((p) => p !== planKey) });
    } else {
      setFormData({ ...formData, targetPlans: [...current, planKey] });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingId) {
        const res = await propertyService.updateProperty(editingId, formData);
        const updatedProp = res?.data?.data || res?.data || res;
        
        if (updatedProp && (updatedProp.id || res?.success || res?.data?.success)) {
          setProperties((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...updatedProp } : p)));
          showToast(
            'Property Listing Updated',
            'Property details saved successfully! Updates are live on the Landing Page.',
            'success',
            true
          );
          setFilterType('all');
          setSearchQuery('');
          setIsModalOpen(false);
          fetchProperties();
        } else {
          showToast('Save Notification', 'Property saved to backend store.', 'success', true);
          setIsModalOpen(false);
          fetchProperties();
        }
      } else {
        const res = await propertyService.createProperty(formData);
        const newProp = res?.data?.data || res?.data || res;
        
        if (newProp && (newProp.id || res?.success || res?.data?.success)) {
          const validProp = newProp.id ? newProp : { ...formData, id: `prop-${Date.now()}` };
          setProperties((prev) => [validProp, ...prev]);
          showToast(
            'New Property Saved & Published!',
            'Property successfully saved and active on Landing Page & Broker Feed.',
            'success',
            true
          );
          setFilterType('all');
          setSearchQuery('');
          setIsModalOpen(false);
          fetchProperties();
        } else {
          showToast('Property Saved', 'Property added to system inventory.', 'success', true);
          setIsModalOpen(false);
          fetchProperties();
        }
      }
    } catch (err) {
      const errorText = err.message || err.response?.data?.message || 'Failed to save property.';
      console.error('Save error:', err);
      showToast('Error Saving Property', errorText, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete listing "${title}"?`)) {
      try {
        await propertyService.deleteProperty(id);
        setProperties((prev) => prev.filter((p) => p.id !== id));
        showToast('Property Listing Deleted', `Listing "${title}" has been removed.`, 'success');
        fetchProperties();
      } catch (err) {
        showToast('Delete Failed', 'Could not delete property.', 'error');
      }
    }
  };

  // Filter & Search Logic
  const filteredProperties = properties.filter((p) => {
    const pPlans = Array.isArray(p.targetPlans) && p.targetPlans.length > 0
      ? p.targetPlans
      : [p.planAccess || p.type || 'base'];

    const matchesType =
      filterType === 'all' ||
      (filterType === 'free' && (pPlans.includes('free') || p.isFree || p.planAccess === 'free')) ||
      (filterType === 'base' && pPlans.includes('base')) ||
      (filterType === 'pro' && (pPlans.includes('pro') || p.isExclusive));

    const matchesSearch =
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.location || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.ownerName || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  const freeCount = properties.filter((p) => (p.targetPlans || [p.planAccess]).includes('free') || p.isFree).length;
  const baseCount = properties.filter((p) => (p.targetPlans || [p.planAccess]).includes('base')).length;
  const proCount = properties.filter((p) => (p.targetPlans || [p.planAccess]).includes('pro') || p.isExclusive).length;

  return (
    <div className="space-y-6 font-sans text-slate-800 pb-16">
      {/* Floating Executive Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] max-w-md w-full transition-all duration-300">
          <div
            className={`flex items-start gap-3.5 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl text-slate-900 ${
              toast.type === 'success'
                ? 'bg-white/95 border-emerald-300 ring-1 ring-emerald-200'
                : 'bg-white/95 border-rose-300 ring-1 ring-rose-200'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                toast.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            </div>
            <div className="flex-1 pr-2">
              <h4 className="font-bold text-xs text-slate-900 leading-tight">{toast.title}</h4>
              <p className="text-[11px] text-slate-600 font-medium mt-1 leading-normal">{toast.text}</p>

              {toast.showLandingLink && (
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition-all shadow-xs"
                  >
                    <span>View Live on Landing Page</span>
                    <ExternalLink size={13} />
                  </Link>
                </div>
              )}
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Classic Executive Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1.5">
              <ShieldCheck size={16} /> Super Admin Real Estate Portal
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Property Inventory & Tier Management
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed font-medium">
              Upload properties and select access checkboxes (<span className="text-emerald-600 font-bold">Free Plan</span>, <span className="text-blue-600 font-bold">Base Plan DI</span>, <span className="text-amber-600 font-bold">Pro Plan</span>) to control visibility across public landing pages and broker feeds.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-200 transition-all active:scale-95"
            >
              <ExternalLink size={15} className="text-slate-500" />
              <span>View Landing Screen</span>
            </Link>

            <button
              onClick={handleOpenCreateModal}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20 active:scale-95"
            >
              <Plus size={16} />
              <span>Post New Property</span>
            </button>
          </div>
        </div>

        {/* Quick Inventory Summary Cards */}
        <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block">Total Listings</span>
            <span className="text-lg font-extrabold text-slate-900 mt-0.5 block">{properties.length}</span>
          </div>
          <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100">
            <span className="text-[11px] font-semibold text-emerald-700 block">Free Plan Listings</span>
            <span className="text-lg font-extrabold text-emerald-900 mt-0.5 block">{freeCount}</span>
          </div>
          <div className="bg-blue-50/70 p-3 rounded-xl border border-blue-100">
            <span className="text-[11px] font-semibold text-blue-700 block">Base DI Listings</span>
            <span className="text-lg font-extrabold text-blue-900 mt-0.5 block">{baseCount}</span>
          </div>
          <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-100">
            <span className="text-[11px] font-semibold text-amber-700 block">Pro Plus Listings</span>
            <span className="text-lg font-extrabold text-amber-900 mt-0.5 block">{proCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Listings ({properties.length})
          </button>

          <button
            onClick={() => setFilterType('free')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'free'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Free Plan ({freeCount})
          </button>

          <button
            onClick={() => setFilterType('base')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'base'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Base Plan ({baseCount})
          </button>

          <button
            onClick={() => setFilterType('pro')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filterType === 'pro'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Pro Plan ({proCount})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, owner..."
            className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
          />
        </div>
      </div>

      {/* Property Inventory Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center p-16 bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <RefreshCw className="animate-spin text-indigo-600 mr-3" size={20} />
          <span className="text-xs font-bold text-slate-600">Loading Property Inventory Feed...</span>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center p-16 bg-white rounded-2xl border border-slate-200/90 space-y-3 shadow-xs">
          <Building2 size={40} className="mx-auto text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">No properties found under this filter</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "Post New Property" above to create real estate listings for brokers and guest users.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((prop) => {
            const plans = Array.isArray(prop.targetPlans) && prop.targetPlans.length > 0
              ? prop.targetPlans
              : [prop.planAccess || prop.type || 'base'];

            return (
              <div
                key={prop.id}
                className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 bg-slate-100 overflow-hidden">
                    <img
                      src={prop.thumbnail || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />

                    {/* Target Plans Badges */}
                    <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
                      {plans.includes('free') && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-emerald-600 text-white shadow-md">
                          <Sparkles size={10} /> Free Plan
                        </span>
                      )}
                      {plans.includes('base') && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-blue-600 text-white shadow-md">
                          <Tag size={10} /> Base Plan
                        </span>
                      )}
                      {plans.includes('pro') && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-extrabold bg-amber-500 text-white shadow-md">
                          <Star size={10} /> Pro Plan
                        </span>
                      )}
                    </div>

                    <div className="absolute top-3 right-3 bg-slate-900/90 backdrop-blur-xs text-white text-xs font-extrabold px-3 py-1 rounded-lg">
                      {prop.price}
                    </div>
                  </div>

                  <div className="p-5 space-y-3.5">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{prop.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1 font-medium">
                        <MapPin size={13} className="text-slate-400 shrink-0" />
                        <span className="truncate">{prop.location}</span>
                      </p>
                    </div>

                    {/* Property Spec Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">{prop.bhk || '3 BHK'}</span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">{prop.bathrooms || '2'} Baths</span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">{prop.carpetArea || '1,200 sq.ft'}</span>
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200">{prop.furnishing || 'Furnished'}</span>
                    </div>

                    {/* Owner Contact Information Box */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <User size={13} className="text-slate-400" /> Direct Owner:
                        </span>
                        <span className="font-bold text-slate-900">{prop.ownerName}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Phone size={13} className="text-slate-400" /> Owner Contact:
                        </span>
                        <span className="font-extrabold text-blue-600 font-mono">{prop.ownerContact}</span>
                      </div>
                    </div>

                    {prop.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 italic font-medium leading-relaxed">
                        {prop.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold text-slate-400">ID: {prop.id}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(prop)}
                      className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition-all"
                      title="Edit Property Listing"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(prop.id, prop.title)}
                      className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all"
                      title="Delete Property Listing"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post / Edit Property Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {editingId ? 'Edit Property Listing' : 'Post New Real Estate Property'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">Configure property parameters & plan tier visibility</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Target Subscription Plan Checkboxes */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sliders size={14} className="text-indigo-600" /> Target Subscription Plan Access (Checkboxes) *
                </label>
                <p className="text-[11px] text-slate-500">
                  Select which subscription tiers can view & unlock this property contact details.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1.5">
                  <button
                    type="button"
                    onClick={() => handleTogglePlanCheckbox('free')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all border ${
                      formData.targetPlans.includes('free')
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {formData.targetPlans.includes('free') ? <CheckSquare size={16} /> : <Square size={16} />}
                    <span>Free Plan</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePlanCheckbox('base')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all border ${
                      formData.targetPlans.includes('base')
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {formData.targetPlans.includes('base') ? <CheckSquare size={16} /> : <Square size={16} />}
                    <span>Base Plan (DI)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTogglePlanCheckbox('pro')}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-bold transition-all border ${
                      formData.targetPlans.includes('pro')
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {formData.targetPlans.includes('pro') ? <CheckSquare size={16} /> : <Square size={16} />}
                    <span>Pro Plan (Pro Plus)</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Property Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. 3 BHK Luxury Apartment in Seawoods"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price / Rent *</label>
                  <input
                    type="text"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. ₹1.85 Cr"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Property Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium bg-white"
                  >
                    <option value="Apartment">Apartment</option>
                    <option value="Villa">Villa</option>
                    <option value="Commercial">Commercial Office</option>
                    <option value="Penthouse">Penthouse</option>
                    <option value="Plot">Plot / Land</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">BHK / Bedrooms</label>
                  <select
                    value={formData.bhk}
                    onChange={(e) => setFormData({ ...formData, bhk: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium bg-white"
                  >
                    <option value="1 BHK">1 BHK Studio</option>
                    <option value="2 BHK">2 BHK</option>
                    <option value="3 BHK">3 BHK</option>
                    <option value="4 BHK">4 BHK</option>
                    <option value="5+ BHK">5+ BHK Villa</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Carpet Area</label>
                  <input
                    type="text"
                    value={formData.carpetArea}
                    onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })}
                    placeholder="e.g. 1,450 sq.ft"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location / Address *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Sector 44, Seawoods, Navi Mumbai"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Direct Owner Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Owner Contact Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerContact}
                    onChange={(e) => setFormData({ ...formData, ownerContact: e.target.value })}
                    placeholder="e.g. +91 98201 44512"
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono font-semibold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Thumbnail Image URL</label>
                  <input
                    type="text"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-[11px]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Property Description</label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Sea view balcony, covered parking, modular kitchen..."
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-indigo-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? <RefreshCw size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  <span>{editingId ? 'Update Listing' : 'Post Property Now'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
