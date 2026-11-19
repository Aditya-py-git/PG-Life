import React, { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Building2, Search } from 'lucide-react';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyFilters } from '../components/property/PropertyFilters';
import { SORT_OPTIONS } from '../utils/constants';
import { api } from '../api/client';

export const PropertyListingPage = ({ initialFilters = {}, onSelectProperty, onScheduleVisit }) => {
  const [filters, setFilters] = useState({
    city: '',
    locality: '',
    gender: 'all',
    min_price: '',
    max_price: 35000,
    room_type: 'all',
    amenities: '',
    search: '',
    sort: 'featured',
    ...initialFilters
  });

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        const res = await api.properties.getAll(filters);
        if (res.success && res.data?.properties) {
          setProperties(res.data.properties);
        }
      } catch (err) {
        console.warn('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      city: '',
      locality: '',
      gender: 'all',
      min_price: '',
      max_price: 35000,
      room_type: 'all',
      amenities: '',
      search: '',
      sort: 'featured'
    });
  };

  const removeFilterBadge = (key, defaultVal = '') => {
    setFilters((prev) => ({ ...prev, [key]: defaultVal }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            {filters.city ? `Student PGs in ${filters.city}` : 'Explore All Verified Accommodations'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Found <span className="font-bold text-slate-900">{properties.length}</span> verified student hostels and co-living stays with zero brokerage
          </p>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            Filters {filters.city || filters.gender !== 'all' ? '(Active)' : ''}
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase hidden sm:inline">Sort:</span>
            <select
              value={filters.sort}
              onChange={(e) => setFilters((prev) => ({ ...prev, sort: e.target.value }))}
              className="px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer shadow-sm"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(filters.city || (filters.gender && filters.gender !== 'all') || filters.search || (filters.room_type && filters.room_type !== 'all')) && (
        <div className="flex flex-wrap items-center gap-2 pt-4">
          <span className="text-xs font-bold text-slate-400">Active Filters:</span>
          {filters.city && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200">
              City: {filters.city}
              <button onClick={() => removeFilterBadge('city')}><X className="w-3 h-3 hover:text-brand-900" /></button>
            </span>
          )}
          {filters.gender && filters.gender !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 capitalize">
              {filters.gender}
              <button onClick={() => removeFilterBadge('gender', 'all')}><X className="w-3 h-3 hover:text-purple-900" /></button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Search: "{filters.search}"
              <button onClick={() => removeFilterBadge('search')}><X className="w-3 h-3 hover:text-slate-900" /></button>
            </span>
          )}
          {filters.room_type && filters.room_type !== 'all' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 capitalize">
              {filters.room_type} sharing
              <button onClick={() => removeFilterBadge('room_type', 'all')}><X className="w-3 h-3 hover:text-emerald-900" /></button>
            </span>
          )}
          <button
            onClick={handleResetFilters}
            className="text-xs font-semibold text-rose-600 hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid: Sidebar + Listings */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar Filters Desktop */}
        <aside className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-28">
          <PropertyFilters
            filters={filters}
            setFilters={setFilters}
            onReset={handleResetFilters}
            totalCount={properties.length}
          />
        </aside>

        {/* Mobile Filters Dropdown */}
        {mobileFilterOpen && (
          <div className="md:hidden col-span-1 mb-4">
            <PropertyFilters
              filters={filters}
              setFilters={setFilters}
              onReset={handleResetFilters}
              totalCount={properties.length}
            />
          </div>
        )}

        {/* Property Cards Grid */}
        <main className="md:col-span-8 lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-96 bg-slate-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onSelect={onSelectProperty}
                  onScheduleVisit={onScheduleVisit}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-20 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No properties matched your criteria</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your price range, selecting "All Cities", or removing some of your amenity filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md hover:bg-brand-700 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>

      </div>

    </div>
  );
};
