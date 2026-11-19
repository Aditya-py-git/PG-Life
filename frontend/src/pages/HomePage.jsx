import React, { useState, useEffect } from 'react';
import {
  Search,
  MapPin,
  ShieldCheck,
  Utensils,
  Wifi,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Star,
  Users,
  Building2,
  CheckCircle2,
  Heart
} from 'lucide-react';
import { CITIES, GENDER_TYPES } from '../utils/constants';
import { PropertyCard } from '../components/property/PropertyCard';
import { api } from '../api/client';

export const HomePage = ({ onNavigateExplore, onSelectProperty, onScheduleVisit }) => {
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedGender, setSelectedGender] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.properties.getFeatured();
        if (res.success && res.data?.properties) {
          setFeaturedProperties(res.data.properties);
        }
      } catch (err) {
        console.warn('Failed to load featured properties:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    onNavigateExplore({
      city: selectedCity,
      gender: selectedGender,
      search: searchKeyword
    });
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-gradient-to-b from-brand-50/60 via-white to-white">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-200/40 via-indigo-100/30 to-rose-100/20 blur-3xl -z-10 rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-brand-200/80 shadow-sm text-xs font-bold text-brand-700 mb-6 animate-in fade-in slide-in-from-bottom-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>Zero Brokerage • 100% Verified Student PGs & Hostels</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.15]">
            Find Your Second Home. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-600">
              Live, Study & Belong
            </span> with PG-Life.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Fully-furnished student accommodations with high-speed Wi-Fi, chef-cooked nutritious meals, 24/7 security, and transparent policies.
          </p>

          {/* Search Box Card */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-3xl shadow-xl shadow-brand-900/5 border border-slate-200/80 p-3 sm:p-4">
            <form onSubmit={handleHeroSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              
              {/* City Selector */}
              <div className="sm:col-span-4 text-left px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Select City
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <MapPin className="w-4 h-4 text-brand-600 shrink-0" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">All Top Cities</option>
                    {CITIES.map((c) => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Gender Preference */}
              <div className="sm:col-span-3 text-left px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Gender
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Users className="w-4 h-4 text-brand-600 shrink-0" />
                  <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="w-full bg-transparent text-sm font-bold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    {GENDER_TYPES.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Locality Search Input */}
              <div className="sm:col-span-3 text-left px-3 py-2 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/80 transition-colors">
                <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Locality / Landmark
                </label>
                <div className="flex items-center gap-2 mt-0.5">
                  <Search className="w-4 h-4 text-brand-600 shrink-0" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="e.g. Koramangala, DU..."
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full h-full py-4 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

            </form>
          </div>

          {/* Quick Stat Highlights */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-slate-200/60 text-slate-600">
            <div>
              <p className="text-2xl font-black text-slate-900">₹0</p>
              <p className="text-xs font-semibold text-slate-500">Zero Brokerage</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">100%</p>
              <p className="text-xs font-semibold text-slate-500">Verified Properties</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">300 Mbps</p>
              <p className="text-xs font-semibold text-slate-500">High-Speed Wi-Fi</p>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">4.8 / 5</p>
              <p className="text-xs font-semibold text-slate-500">Student Satisfaction</p>
            </div>
          </div>

        </div>
      </section>

      {/* TOP STUDENT CITIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Explore Localities</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Top Student & IT Hub Cities
            </h2>
          </div>
          <button
            onClick={() => onNavigateExplore({})}
            className="flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>View All Cities</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {CITIES.map((city) => (
            <div
              key={city.name}
              onClick={() => onNavigateExplore({ city: city.name })}
              className="group relative h-64 rounded-3xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <h3 className="text-lg font-black">{city.name}</h3>
                <p className="text-xs text-slate-300 line-clamp-1">{city.tagline}</p>
                <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-brand-300 group-hover:text-white transition-colors">
                  <span>Explore PGs</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PROPERTIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Handpicked Stays</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Featured Verified Accommodations
            </h2>
          </div>
          <button
            onClick={() => onNavigateExplore({})}
            className="flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <span>Browse All {featuredProperties.length} Properties</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
                onScheduleVisit={onScheduleVisit}
              />
            ))}
          </div>
        )}
      </section>

      {/* WHY CHOOSE PG-LIFE */}
      <section className="bg-slate-900 text-white py-20 rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-400">The PG-Life Advantage</span>
          <h2 className="text-3xl sm:text-4xl font-black mt-2">
            Why Students & Working Professionals Choose PG-Life
          </h2>
          <p className="mt-4 text-slate-400 text-sm leading-relaxed">
            Finding a PG used to mean paying hefty brokerage, dealing with shady landlords, and enduring unhygienic rooms. We reinvented the student accommodation experience.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">100% Zero Brokerage</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Never pay arbitrary broker fees. Deal directly with verified hosts with clear contracts and 100% refundable security deposits.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
              <Utensils className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Hygienic Home-Style Food</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              3 wholesome chef-curated meals daily with North & South Indian options. Clean, certified kitchens inspected regularly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-brand-500/50 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
              <Wifi className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Campus Grade Wi-Fi & Power</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Dual-ISP fiber broadband with automatic failover and 24/7 generator backup so your coursework and remote shifts never pause.
            </p>
          </div>
        </div>
      </section>

      {/* STUDENT TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Student Voices</span>
          <h2 className="text-3xl font-black text-slate-900 mt-1">
            Loved by 15,000+ Students Across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Aarav Patel',
              college: 'IIT Bombay (Powai)',
              stay: 'Zenith Co-Living Suites',
              text: 'The 360 virtual visit convinced me before I even boarded my flight to Mumbai. When I checked in, the room was identical to the photos!',
              avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80'
            },
            {
              name: 'Sneha Roy',
              college: 'Delhi University (Hindu College)',
              stay: 'The Scholar Hub North Campus',
              text: 'Safety was my parents primary worry. With biometric gate security, female wardens, and instant complaint resolution on the portal, it is peace of mind.',
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80'
            },
            {
              name: 'Karthik Menon',
              college: 'Software Engineer @ Infosys Bangalore',
              stay: 'Stanza Cambridge Koramangala',
              text: 'The community events, PS5 lounge, and super fast Wi-Fi made my relocation so seamless. Best co-living experience in Koramangala.',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
            }
          ].map((t, idx) => (
            <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-700 italic leading-relaxed">
                  "{t.text}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                  <p className="text-[11px] text-slate-500">{t.college}</p>
                  <p className="text-[10px] text-brand-600 font-semibold">{t.stay}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
