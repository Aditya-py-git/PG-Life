import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Heart,
  Wrench,
  User,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  ArrowRight,
  Video,
  Users,
  Building2,
  Trash2
} from 'lucide-react';
import { api } from '../api/client';
import { formatCurrency, formatDate, getStatusBadgeClass } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';

export const StudentDashboardPage = ({ onSelectProperty }) => {
  const { user, updateProfile } = useAuth();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { notifySuccess, notifyError } = useNotification();

  const [activeTab, setActiveTab] = useState('bookings'); // bookings | visits | wishlist | complaints | profile
  const [bookings, setBookings] = useState([]);
  const [visits, setVisits] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Complaint Form
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    property_id: '',
    category: 'wifi',
    title: '',
    description: '',
    priority: 'medium'
  });

  // Profile Form
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    college_or_company: user?.college_or_company || ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookRes, visRes, compRes] = await Promise.all([
        api.bookings.getMyBookings(),
        api.visits.getMyVisits(),
        api.complaints.getMyComplaints()
      ]);

      if (bookRes.success) setBookings(bookRes.data?.bookings || []);
      if (visRes.success) setVisits(visRes.data?.visits || []);
      if (compRes.success) setComplaints(compRes.data?.complaints || []);
    } catch (err) {
      console.warn('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRaiseComplaint = async (e) => {
    e.preventDefault();
    try {
      const targetPropertyId = newComplaint.property_id || bookings[0]?.property_id;
      if (!targetPropertyId) {
        notifyError('Please select a property for this maintenance request.');
        return;
      }

      const res = await api.complaints.create({
        ...newComplaint,
        property_id: targetPropertyId
      });

      if (res.success) {
        notifySuccess('Maintenance ticket raised! Caretaker has been alerted.');
        setShowComplaintForm(false);
        setNewComplaint({ property_id: '', category: 'wifi', title: '', description: '', priority: 'medium' });
        fetchData();
      }
    } catch (err) {
      notifyError(err.message || 'Failed to submit complaint.');
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      notifySuccess('Profile updated successfully!');
    } catch (err) {
      notifyError('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Student Welcome Header Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-indigo-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-white/20 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black">{user?.name}</h1>
              <span className="text-[10px] font-extrabold uppercase bg-brand-500/30 border border-brand-400/40 text-brand-200 px-2.5 py-0.5 rounded-full">
                Student Member
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {user?.college_or_company || 'College / University Scholar'} • {user?.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-lg font-black block">{bookings.length}</span>
            <span className="text-[10px] text-slate-300 uppercase font-semibold">Active Stays</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-lg font-black block">{visits.length}</span>
            <span className="text-[10px] text-slate-300 uppercase font-semibold">Visits</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
            <span className="text-lg font-black block">{wishlistItems.length}</span>
            <span className="text-[10px] text-slate-300 uppercase font-semibold">Shortlist</span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { id: 'bookings', label: 'My Bookings', icon: Calendar, badge: bookings.length },
          { id: 'visits', label: 'Scheduled Visits', icon: Clock, badge: visits.length },
          { id: 'wishlist', label: 'Saved Shortlist', icon: Heart, badge: wishlistItems.length },
          { id: 'complaints', label: 'Maintenance Desk', icon: Wrench, badge: complaints.length },
          { id: 'profile', label: 'Student Profile', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                  isActive ? 'bg-white text-brand-700' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-extrabold text-slate-900">Your Accommodation Bookings</h3>
          </div>

          {bookings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookings.map((b) => (
                <div key={b.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                        Booking ID: {b.booking_code}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1.5">
                        {b.property_title}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" />
                        {b.locality}, {b.city}
                      </p>
                    </div>

                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border capitalize ${getStatusBadgeClass(b.booking_status)}`}>
                      {b.booking_status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Room Type</span>
                      <span className="font-bold text-slate-900 capitalize">{b.room_title || `${b.room_type} Sharing`}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Move-in Date</span>
                      <span className="font-bold text-slate-900">{formatDate(b.check_in_date)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Monthly Rent</span>
                      <span className="font-bold text-slate-900">{formatCurrency(b.monthly_rent)}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Initial Amount</span>
                      <span className="font-extrabold text-emerald-700">{formatCurrency(b.total_initial_amount)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">Host: <strong>{b.owner_name}</strong></span>
                    <button
                      onClick={() => onSelectProperty?.({ id: b.property_id })}
                      className="text-brand-600 font-bold hover:underline flex items-center gap-1"
                    >
                      View PG Details <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No bookings yet</h4>
              <p className="text-xs text-slate-500">Explore verified student rooms and reserve with zero brokerage</p>
            </div>
          )}
        </div>
      )}

      {/* 2. VISITS */}
      {activeTab === 'visits' && (
        <div className="space-y-6">
          <h3 className="text-lg font-extrabold text-slate-900">Scheduled Property Visits</h3>
          {visits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visits.map((v) => (
                <div key={v.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${getStatusBadgeClass(v.status)}`}>
                        {v.status}
                      </span>
                      <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded flex items-center gap-1">
                        {v.visit_type === 'virtual_video_call' ? <Video className="w-3 h-3" /> : <Users className="w-3 h-3" />}
                        {v.visit_type === 'virtual_video_call' ? 'Virtual Tour' : 'Physical Visit'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{v.property_title}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(v.visit_date)} at {v.time_slot}
                    </p>
                    {v.notes && (
                      <p className="text-xs text-slate-600 italic mt-1">"{v.notes}"</p>
                    )}
                  </div>
                  <button
                    onClick={() => onSelectProperty?.({ id: v.property_id })}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold"
                  >
                    View PG
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <Clock className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No visits scheduled</h4>
              <p className="text-xs text-slate-500">Pick any PG and book a free physical or virtual inspection tour</p>
            </div>
          )}
        </div>
      )}

      {/* 3. WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <h3 className="text-lg font-extrabold text-slate-900">Saved Shortlist ({wishlistItems.length})</h3>
          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((p) => (
                <div key={p.id} className="p-4 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100 mb-3 relative">
                    <img src={p.cover_image || p.image_url} alt={p.title} className="w-full h-full object-cover" />
                    <button
                      onClick={() => toggleWishlist(p)}
                      className="absolute top-2 right-2 p-2 rounded-full bg-white/90 text-rose-500 shadow"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{p.title}</h4>
                    <p className="text-xs text-slate-500">{p.locality}, {p.city}</p>
                    <p className="text-sm font-extrabold text-brand-700 mt-2">{formatCurrency(p.starting_price)} /mo</p>
                  </div>
                  <button
                    onClick={() => onSelectProperty?.(p)}
                    className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <Heart className="w-12 h-12 text-slate-300 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">Your shortlist is empty</h4>
              <p className="text-xs text-slate-500">Click the heart icon on any PG card to bookmark it for later</p>
            </div>
          )}
        </div>
      )}

      {/* 4. COMPLAINTS & MAINTENANCE */}
      {activeTab === 'complaints' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Tenant Maintenance Desk</h3>
              <p className="text-xs text-slate-500">Raise repair tickets for Wi-Fi, plumbing, cleaning, or food</p>
            </div>
            <button
              onClick={() => setShowComplaintForm(!showComplaintForm)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-md hover:bg-brand-700 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Raise Ticket</span>
            </button>
          </div>

          {/* Form */}
          {showComplaintForm && (
            <form onSubmit={handleRaiseComplaint} className="p-6 rounded-3xl bg-white border-2 border-brand-200 shadow-lg space-y-4 animate-in fade-in">
              <h4 className="text-sm font-bold text-slate-900">New Issue Ticket</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Category</label>
                  <select
                    value={newComplaint.category}
                    onChange={(e) => setNewComplaint({ ...newComplaint, category: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    <option value="wifi">High-Speed Wi-Fi Issue</option>
                    <option value="plumbing">Plumbing / Water Supply</option>
                    <option value="electrical">Electrical / Power / AC</option>
                    <option value="cleaning">Housekeeping / Room Cleaning</option>
                    <option value="food">Mess Food Quality</option>
                    <option value="other">Other Query</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Priority</label>
                  <select
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint({ ...newComplaint, priority: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    <option value="low">Low (General Query)</option>
                    <option value="medium">Medium (Standard)</option>
                    <option value="high">High (Urgent Repair)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Issue Summary</label>
                <input
                  type="text"
                  required
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
                  placeholder="e.g. Geyser water not heating in room 204"
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
                  placeholder="Detailed description of the issue..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowComplaintForm(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          )}

          {/* Tickets List */}
          {complaints.length > 0 ? (
            <div className="space-y-3">
              {complaints.map((c) => (
                <div key={c.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize ${getStatusBadgeClass(c.status)}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-slate-400">
                        Category: {c.category}
                      </span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-900">{c.title}</h5>
                    <p className="text-[11px] text-slate-500 mt-0.5">{c.description}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{formatDate(c.created_at)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h4 className="text-base font-bold text-slate-800">No active maintenance issues</h4>
              <p className="text-xs text-slate-500">Your stay is smooth and maintenance tickets are all resolved!</p>
            </div>
          )}
        </div>
      )}

      {/* 5. PROFILE */}
      {activeTab === 'profile' && (
        <div className="max-w-xl mx-auto p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-lg font-extrabold text-slate-900">Student Profile & University</h3>
          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Phone Number</label>
              <input
                type="text"
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-1">College / University</label>
              <input
                type="text"
                value={profileForm.college_or_company}
                onChange={(e) => setProfileForm({ ...profileForm, college_or_company: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

    </div>
  );
};
