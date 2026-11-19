import React, { useState } from 'react';
import { X, Building2, Check, ArrowRight, ArrowLeft, Plus, Trash2, Sparkles, UploadCloud } from 'lucide-react';
import { api } from '../../api/client';
import { CITIES, GENDER_TYPES, AMENITIES_CATALOG } from '../../utils/constants';
import { useNotification } from '../../context/NotificationContext';

export const AddPropertyModal = ({ isOpen, onClose, onPropertyAdded }) => {
  const { notifySuccess, notifyError } = useNotification();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    gender_type: 'unisex',
    city: 'Bangalore',
    locality: '',
    address: '',
    pincode: '',
    gate_closing_time: '10:30 PM',
    food_available: 1,
    food_type: 'both',
    starting_price: 8500,
    security_deposit: 12000,
    notice_period_days: 30,
    amenities: ['wifi', 'ac', 'power_backup', 'ro_water', 'cctv', 'laundry', 'cook_mess', 'housekeeping'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80'],
    rules: ['No smoking in rooms', 'Gate closes at 10:30 PM', 'Keep common areas clean'],
    rooms: [
      { room_type: 'single', title: 'Deluxe Single Room', monthly_rent: 14000, security_deposit: 20000, total_beds: 4, available_beds: 2, has_ac: 1, has_attached_bathroom: 1 },
      { room_type: 'double', title: 'Twin Sharing Room', monthly_rent: 9500, security_deposit: 14000, total_beds: 12, available_beds: 5, has_ac: 1, has_attached_bathroom: 1 }
    ]
  });

  if (!isOpen) return null;

  const updateField = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  const toggleAmenity = (key) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(key);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter((k) => k !== key) : [...prev.amenities, key]
      };
    });
  };

  const handleAddRoom = () => {
    setFormData((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        { room_type: 'triple', title: 'Triple Sharing Room', monthly_rent: 7500, security_deposit: 10000, total_beds: 9, available_beds: 3, has_ac: 0, has_attached_bathroom: 1 }
      ]
    }));
  };

  const handleRemoveRoom = (index) => {
    setFormData((prev) => ({
      ...prev,
      rooms: prev.rooms.filter((_, i) => i !== index)
    }));
  };

  const handleRoomChange = (index, field, value) => {
    setFormData((prev) => {
      const copy = [...prev.rooms];
      copy[index] = { ...copy[index], [field]: value };
      return { ...prev, rooms: copy };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await api.properties.create(formData);
      if (res.success) {
        notifySuccess('Property listed successfully! Students can now view and book it.');
        onPropertyAdded?.(res.data.property);
        onClose();
      }
    } catch (err) {
      notifyError(err.message || 'Failed to list property. Check required fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header with Step Tracker */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
              Host Onboarding Wizard (Step {step} of 4)
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
              List Your PG Property
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-emerald-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                  placeholder="e.g. Royal Orchid Luxury Co-living & Suites"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Highlight proximity to IT parks/colleges, food quality, safety, and community vibe..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Gender Allowance
                  </label>
                  <select
                    value={formData.gender_type}
                    onChange={(e) => updateField('gender_type', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white"
                  >
                    <option value="unisex">Co-Living / Unisex</option>
                    <option value="female">Girls Only PG</option>
                    <option value="male">Boys Only PG</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Gate Curfew Time
                  </label>
                  <input
                    type="text"
                    value={formData.gate_closing_time}
                    onChange={(e) => updateField('gate_closing_time', e.target.value)}
                    placeholder="e.g. 10:30 PM or No Curfew"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Location */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    City *
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white"
                  >
                    {CITIES.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Locality / Area *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.locality}
                    onChange={(e) => updateField('locality', e.target.value)}
                    placeholder="e.g. Koramangala 4th Block"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Complete Street Address *
                </label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Plot/Building number, street, landmark..."
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  PIN Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => updateField('pincode', e.target.value)}
                  placeholder="e.g. 560034"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Amenities & Meals */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-900 block">Food & Meal Service</span>
                  <p className="text-[11px] text-amber-700">Does your PG provide daily breakfast, lunch, or dinner?</p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.food_type}
                    onChange={(e) => updateField('food_type', e.target.value)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-300 bg-white"
                  >
                    <option value="both">Veg & Non-Veg</option>
                    <option value="veg">Pure Veg Only</option>
                    <option value="none">Self Cooking / None</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Provided Amenities
                </label>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {Object.entries(AMENITIES_CATALOG).map(([key, item]) => {
                    const isChecked = formData.amenities.includes(key);
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleAmenity(key)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold text-left transition-all ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'}`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  High Quality Cover Photo URL
                </label>
                <input
                  type="url"
                  value={formData.images[0] || ''}
                  onChange={(e) => updateField('images', [e.target.value])}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Rooms & Pricing */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Starting Monthly Rent (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.starting_price}
                    onChange={(e) => updateField('starting_price', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Security Deposit (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.security_deposit}
                    onChange={(e) => updateField('security_deposit', Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-extrabold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Room Configurations ({formData.rooms.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleAddRoom}
                    className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Room
                  </button>
                </div>

                <div className="space-y-3">
                  {formData.rooms.map((room, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={room.title}
                          onChange={(e) => handleRoomChange(idx, 'title', e.target.value)}
                          placeholder="Room Title"
                          className="font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200 flex-1"
                        />
                        <select
                          value={room.room_type}
                          onChange={(e) => handleRoomChange(idx, 'room_type', e.target.value)}
                          className="font-semibold text-slate-700 bg-white px-2 py-1 rounded border border-slate-200 capitalize"
                        >
                          <option value="single">Single</option>
                          <option value="double">Double</option>
                          <option value="triple">Triple</option>
                          <option value="four_sharing">Four Sharing</option>
                        </select>
                        {formData.rooms.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRoom(idx)}
                            className="p-1 text-rose-500 hover:bg-rose-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block">Rent / Bed</span>
                          <input
                            type="number"
                            value={room.monthly_rent}
                            onChange={(e) => handleRoomChange(idx, 'monthly_rent', Number(e.target.value))}
                            className="w-full px-2 py-1 rounded border border-slate-200 font-bold"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Total Beds</span>
                          <input
                            type="number"
                            value={room.total_beds}
                            onChange={(e) => handleRoomChange(idx, 'total_beds', Number(e.target.value))}
                            className="w-full px-2 py-1 rounded border border-slate-200 font-bold"
                          />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">Avail. Beds</span>
                          <input
                            type="number"
                            value={room.available_beds}
                            onChange={(e) => handleRoomChange(idx, 'available_beds', Number(e.target.value))}
                            className="w-full px-2 py-1 rounded border border-slate-200 font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous Step
              </button>
            ) : <div />}

            {step < 4 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Publishing Listing...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Publish PG to PG-Life</span>
                  </>
                )}
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
