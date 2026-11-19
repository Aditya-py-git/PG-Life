import React, { useState, useEffect } from 'react';
import {
  Building2,
  TrendingUp,
  Users,
  Calendar,
  Wrench,
  DollarSign,
  Plus,
  Check,
  X,
  Clock,
  Sparkles,
  Bed,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { api } from '../api/client';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { AddPropertyModal } from '../components/owner/AddPropertyModal';

export const OwnerDashboardPage = ({ onSelectProperty }) => {
  const { user } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [stats, setStats] = useState(null);
  const [properties, setProperties] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [activeTab, setActiveTab] = useState('properties'); // properties | visits | bookings | complaints
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const loadOwnerData = async () => {
    setLoading(true);
    try {
      const [statsRes, propRes, bookRes, visRes, compRes] = await Promise.all([
        api.stats.getOwnerDashboard(),
        api.properties.getMyProperties(),
        api.bookings.getOwnerBookings(),
        api.visits.getOwnerVisits(),
        api.complaints.getOwnerComplaints()
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (propRes.success) setProperties(propRes.data?.properties || []);
      if (bookRes.success) setBookings(bookRes.data?.bookings || []);
      if (visRes.success) setVisits(visRes.data?.visits || []);
      if (compRes.success) setComplaints(compRes.data?.complaints || []);
    } catch (err) {
      console.warn('Host dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, []);

  const handleUpdateVisitStatus = async (visitId, status) => {
    try {
      const res = await api.visits.updateStatus(visitId, status);
      if (res.success) {
        notifySuccess(`Visit marked as ${status}`);
        loadOwnerData();
      }
    } catch (err) {
      notifyError('Failed to update visit status.');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      const res = await api.bookings.updateStatus(bookingId, status);
      if (res.success) {
        notifySuccess(`Booking status updated to ${status}`);
        loadOwnerData();
      }
    } catch (err) {
      notifyError('Failed to update booking status.');
    }
  };

  const handleUpdateComplaintStatus = async (complaintId, status) => {
    try {
      const res = await api.complaints.updateStatus(complaintId, status);
      if (res.success) {
        notifySuccess(`Ticket marked as ${status}`);
        loadOwnerData();
      }
    } catch (err) {
      notifyError('Failed to update complaint status.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Host Management Portal
            </span>
            <span className="text-xs text-slate-400">• Database: {stats?.db_driver || 'SQLite / MySQL'}</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 mt-1">
            {user?.name || 'Property Host'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {user?.college_or_company || 'Independent Co-Living Operator'} • Real-time occupancy & tenant desk
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg shadow-emerald-600/25 transition-all"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span>List New PG Property</span>
        </button>
      </div>

      {/* ANALYTICS STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* Total Properties */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-2">
            <Building2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400">Properties</span>
          <p className="text-2xl font-black text-slate-900">{stats?.total_properties || properties.length}</p>
        </div>

        {/* Occupancy Rate */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400">Occupancy</span>
          <p className="text-2xl font-black text-slate-900">{stats?.occupancy_rate || 75}%</p>
          <span className="text-[10px] text-slate-400 font-semibold">{stats?.occupied_beds || 0}/{stats?.total_beds || 0} Beds</span>
        </div>

        {/* Monthly Revenue */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <DollarSign className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400">Monthly Rent</span>
          <p className="text-xl font-black text-slate-900">{formatCurrency(stats?.monthly_revenue || 42000)}</p>
        </div>

        {/* Active Tenants */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400">Active Tenants</span>
          <p className="text-2xl font-black text-slate-900">{stats?.active_tenants || bookings.length}</p>
        </div>

        {/* Pending Visits */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <Calendar className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400">Visit Requests</span>
          <p className="text-2xl font-black text-slate-900">{stats?.pending_visits || visits.length}</p>
        </div>

        {/* Open Complaints */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
            <Wrench className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-400">Open Tickets</span>
          <p className="text-2xl font-black text-slate-900">{stats?.open_complaints || complaints.length}</p>
        </div>

      </div>

      {/* Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'properties', label: 'My Listed Properties', count: properties.length },
          { id: 'visits', label: 'Visit Appointments', count: visits.length },
          { id: 'bookings', label: 'Tenant Bookings', count: bookings.length },
          { id: 'complaints', label: 'Maintenance Desk', count: complaints.length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* TAB 1: PROPERTIES */}
      {activeTab === 'properties' && (
        <div className="space-y-4">
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <div key={p.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 relative">
                      <img src={p.cover_image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'} alt={p.title} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-md text-white capitalize">
                        {p.gender_type} PG
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{p.title}</h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" />
                        {p.locality}, {p.city}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 text-xs">
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Beds</span>
                        <span className="font-extrabold text-slate-800">{p.total_beds_count || 12} beds</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">Available</span>
                        <span className="font-extrabold text-emerald-600">{p.available_beds_count || 4} vacant</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-black text-slate-900">{formatCurrency(p.starting_price)} /mo</span>
                    <button
                      onClick={() => onSelectProperty?.(p)}
                      className="px-3.5 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 font-bold text-xs transition-all"
                    >
                      View Live Page
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No properties listed yet</h4>
              <p className="text-xs text-slate-500">List your PG or co-living space and reach thousands of verified students</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: VISITS */}
      {activeTab === 'visits' && (
        <div className="space-y-4">
          {visits.length > 0 ? (
            <div className="space-y-3">
              {visits.map((v) => (
                <div key={v.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${getStatusBadgeClass(v.status)}`}>
                        {v.status}
                      </span>
                      <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                        {v.visit_type === 'virtual_video_call' ? '📹 Virtual Video Tour' : '🚶 In-Person Visit'}
                      </span>
                    </div>
                    <h5 className="text-sm font-extrabold text-slate-900">{v.student_name} ({v.student_phone})</h5>
                    <p className="text-xs text-slate-600 font-medium">
                      Property: <strong>{v.property_title}</strong> • Appointment: <strong>{formatDate(v.visit_date)} ({v.time_slot})</strong>
                    </p>
                    {v.notes && <p className="text-xs text-slate-500 italic">Query: "{v.notes}"</p>}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {v.status === 'scheduled' && (
                      <>
                        <button
                          onClick={() => handleUpdateVisitStatus(v.id, 'completed')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => handleUpdateVisitStatus(v.id, 'cancelled')}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200"
                        >
                          Decline
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No scheduled visit requests</h4>
              <p className="text-xs text-slate-500">Upcoming student appointments will show up here</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {bookings.length > 0 ? (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${getStatusBadgeClass(b.booking_status)}`}>
                        {b.booking_status}
                      </span>
                      <span className="text-[10px] font-extrabold text-brand-700">{b.booking_code}</span>
                    </div>
                    <h5 className="text-sm font-extrabold text-slate-900">{b.student_name} ({b.student_phone})</h5>
                    <p className="text-xs text-slate-600">
                      Property: <strong>{b.property_title}</strong> • Room: <strong>{b.room_title || `${b.room_type} sharing`}</strong>
                    </p>
                    <p className="text-xs text-slate-500">
                      Move-in: <strong>{formatDate(b.check_in_date)}</strong> • Monthly Rent: <strong>{formatCurrency(b.monthly_rent)}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {b.booking_status === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'active')}
                        className="px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm"
                      >
                        Confirm Check-In
                      </button>
                    )}
                    {b.booking_status === 'active' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold"
                      >
                        Complete Tenancy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No student bookings yet</h4>
              <p className="text-xs text-slate-500">When students confirm bed reservations, they will appear here</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="space-y-4">
          {complaints.length > 0 ? (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${getStatusBadgeClass(c.status)}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Category: {c.category}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">{c.title}</h5>
                    <p className="text-xs text-slate-600">{c.description}</p>
                    <p className="text-[10px] text-slate-400">
                      Reported by {c.student_name} ({c.student_phone}) • {c.property_title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {c.status !== 'resolved' ? (
                      <button
                        onClick={() => handleUpdateComplaintStatus(c.id, 'resolved')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Resolved
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <Wrench className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No open complaints</h4>
              <p className="text-xs text-slate-500">All tenant repair requests are cleared!</p>
            </div>
          )}
        </div>
      )}

      {/* Add Property Modal */}
      <AddPropertyModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onPropertyAdded={loadOwnerData}
      />

    </div>
  );
};
