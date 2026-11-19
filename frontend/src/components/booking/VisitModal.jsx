import React, { useState } from 'react';
import { X, Calendar, Clock, Video, Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../api/client';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const VisitModal = ({ property, isOpen, onClose }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM - 12:00 PM');
  const [visitType, setVisitType] = useState('in_person');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scheduled, setScheduled] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.visits.create({
        property_id: property.id,
        visit_date: visitDate,
        time_slot: timeSlot,
        visit_type: visitType,
        notes: notes
      });

      if (res.success) {
        setScheduled(true);
        notifySuccess('Visit scheduled successfully! The host will contact you.');
      }
    } catch (err) {
      notifyError(err.message || 'Failed to schedule visit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
              Schedule Property Visit
            </span>
            <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
              {property.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {scheduled ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Visit Scheduled!</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your appointment on <strong>{formatDate(visitDate)}</strong> at <strong>{timeSlot}</strong> has been booked. The property caretaker has received your request.
              </p>
              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Type: In-Person vs Virtual Tour */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Visit Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVisitType('in_person')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      visitType === 'in_person'
                        ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Physical Visit</span>
                      <span className="text-[11px] text-slate-500">Visit in-person & inspect room</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisitType('virtual_video_call')}
                    className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      visitType === 'virtual_video_call'
                        ? 'border-brand-600 bg-brand-50/70 text-brand-900 ring-2 ring-brand-500/20'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Video className="w-5 h-5 text-brand-600 mt-0.5 shrink-0" />
                    <div>
                      <span className="block text-xs font-bold text-slate-900">Virtual 360 Tour</span>
                      <span className="text-[11px] text-slate-500">Live guided video call</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Select Date
                </label>
                <input
                  type="date"
                  required
                  value={visitDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setVisitDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '10:00 AM - 12:00 PM',
                    '01:00 PM - 03:00 PM',
                    '03:00 PM - 05:00 PM',
                    '05:00 PM - 07:00 PM'
                  ].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                        timeSlot === slot
                          ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Special Query for Caretaker (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Want to see kitchen & single occupancy room"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {isSubmitting ? (
                  <span>Scheduling appointment...</span>
                ) : (
                  <>
                    <span>Confirm Visit Schedule</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
