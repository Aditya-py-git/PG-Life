import React, { useState } from 'react';
import { X, Calendar, ShieldCheck, CheckCircle2, CreditCard, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../../api/client';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const BookingModal = ({ property, selectedRoom, isOpen, onClose, onBookingSuccess }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [checkInDate, setCheckInDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    return d.toISOString().split('T')[0];
  });
  const [stayMonths, setStayMonths] = useState(6);
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);

  if (!isOpen) return null;

  const room = selectedRoom || property.rooms?.[0];
  if (!room) {
    return null;
  }

  const monthlyRent = Number(room.monthly_rent) || 0;
  const securityDeposit = Number(room.security_deposit) || (monthlyRent * 1.5);
  const totalDue = monthlyRent + securityDeposit;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.bookings.create({
        property_id: property.id,
        room_id: room.id,
        check_in_date: checkInDate,
        stay_duration_months: stayMonths,
        payment_method: paymentMethod,
        special_requests: specialRequests
      });

      if (res.success && res.data?.booking) {
        setBookingResult(res.data.booking);
        notifySuccess('Your room has been booked successfully!');
        onBookingSuccess?.(res.data.booking);
      }
    } catch (err) {
      notifyError(err.message || 'Booking failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
              Instant Booking Reservation
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {bookingResult ? (
            /* Success State */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-black text-slate-900">Booking Confirmed!</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Congratulations! Your bed in <strong>{room.title}</strong> is reserved. A confirmation receipt has been issued.
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left max-w-md mx-auto space-y-2.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Booking ID:</span>
                  <span className="font-extrabold text-brand-700">{bookingResult.booking_code}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Move-in Date:</span>
                  <span className="font-bold text-slate-900">{formatDate(bookingResult.check_in_date)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Room Category:</span>
                  <span className="font-bold text-slate-900 capitalize">{bookingResult.room_type} Sharing</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Total Paid:</span>
                  <span className="font-extrabold text-emerald-700">{formatCurrency(bookingResult.total_initial_amount)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Confirmed & Bed Allocated
                  </span>
                </div>
              </div>

              <div className="pt-4 flex gap-3 justify-center">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md"
                >
                  Go to Student Portal
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Selected Room Pill */}
              <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-brand-700 uppercase tracking-wider block">Selected Room Category</span>
                  <h5 className="font-bold text-slate-900 text-sm mt-0.5">{room.title}</h5>
                  <p className="text-xs text-slate-500 capitalize">{room.room_type} sharing room</p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-brand-700">{formatCurrency(room.monthly_rent)}</span>
                  <span className="text-xs text-slate-500"> /month</span>
                </div>
              </div>

              {/* Move-in Date & Stay Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Move-in Date
                  </label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Stay Duration
                  </label>
                  <select
                    value={stayMonths}
                    onChange={(e) => setStayMonths(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  >
                    <option value={3}>3 Months</option>
                    <option value={6}>6 Months (Standard)</option>
                    <option value={9}>9 Months</option>
                    <option value={12}>12 Months (Best Value)</option>
                  </select>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['UPI', 'Net Banking', 'Card'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === method
                          ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Special Notes or Dietary Preference (Optional)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Vegetarian food, quiet study corner bed"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              {/* Price Calculation Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>First Month Rent:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(monthlyRent)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Refundable Security Deposit:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(securityDeposit)}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Brokerage & Documentation Fee:</span>
                  <span>₹0 (Zero Brokerage!)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                  <span>Total Amount Payable:</span>
                  <span className="text-base text-brand-600">{formatCurrency(totalDue)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Processing Payment & Reservation...</span>
                ) : (
                  <>
                    <span>Confirm & Pay {formatCurrency(totalDue)}</span>
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
