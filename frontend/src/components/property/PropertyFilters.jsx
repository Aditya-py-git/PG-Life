import React from 'react';
import { Filter, X, RotateCcw, Search, Sparkles } from 'lucide-react';
import { CITIES, GENDER_TYPES, ROOM_TYPES, AMENITIES_CATALOG, SORT_OPTIONS } from '../../utils/constants';

export const PropertyFilters = ({ filters, setFilters, onReset, totalCount }) => {
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAmenity = (key) => {
    setFilters((prev) => {
      const current = prev.amenities ? prev.amenities.split(',').filter(Boolean) : [];
      let updated;
      if (current.includes(key)) {
        updated = current.filter((k) => k !== key);
      } else {
        updated = [...current, key];
      }
      return { ...prev, amenities: updated.join(',') };
    });
  };

  const activeAmenities = filters.amenities ? filters.amenities.split(',').filter(Boolean) : [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-brand-600" />
          <h3 className="font-extrabold text-slate-900 text-base">Filter PGs</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Search Locality / Name
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="e.g. Koramangala, Powai..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          City
        </label>
        <select
          value={filters.city || ''}
          onChange={(e) => updateFilter('city', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        >
          <option value="">All Indian Cities</option>
          {CITIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Gender Preference */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Gender Preference
        </label>
        <div className="grid grid-cols-2 gap-2">
          {GENDER_TYPES.map((g) => (
            <button
              key={g.value}
              type="button"
              onClick={() => updateFilter('gender', g.value)}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-left ${
                (filters.gender === g.value || (!filters.gender && g.value === 'all'))
                  ? 'bg-brand-50 border-brand-500 text-brand-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Max Budget Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Max Budget / Mo
          </label>
          <span className="text-xs font-extrabold text-brand-600">
            ₹{Number(filters.max_price || 30000).toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="4000"
          max="35000"
          step="500"
          value={filters.max_price || 30000}
          onChange={(e) => updateFilter('max_price', e.target.value)}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
          <span>₹4,000</span>
          <span>₹20,000</span>
          <span>₹35,000+</span>
        </div>
      </div>

      {/* Room Sharing Type */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Room Sharing Type
        </label>
        <select
          value={filters.room_type || 'all'}
          onChange={(e) => updateFilter('room_type', e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        >
          {ROOM_TYPES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
      </div>

      {/* Amenities Checkboxes */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Must-Have Amenities
        </label>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {['wifi', 'ac', 'cook_mess', 'power_backup', 'laundry', 'gym', 'cctv', 'biometric_entry', 'parking'].map((key) => {
            const isChecked = activeAmenities.includes(key);
            const item = AMENITIES_CATALOG[key];

            return (
              <label
                key={key}
                onClick={() => toggleAmenity(key)}
                className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs font-semibold cursor-pointer select-none transition-all ${
                  isChecked
                    ? 'bg-brand-50 border-brand-300 text-brand-900'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  readOnly
                  className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
                />
                <span>{item?.label || key}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Total Found Helper */}
      <div className="pt-4 border-t border-slate-100 text-center">
        <span className="text-xs font-bold text-slate-500">
          Showing <span className="text-slate-900 font-extrabold">{totalCount}</span> properties
        </span>
      </div>

    </div>
  );
};
