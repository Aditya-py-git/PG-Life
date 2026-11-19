import React, { useState } from 'react';
import { X, Star, Send } from 'lucide-react';
import { api } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

export const ReviewModal = ({ property, isOpen, onClose, onReviewSubmitted }) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [rating, setRating] = useState(5);
  const [cleanliness, setCleanliness] = useState(5);
  const [food, setFood] = useState(5);
  const [safety, setSafety] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.reviews.create({
        property_id: property.id,
        rating,
        cleanliness_rating: cleanliness,
        food_rating: food,
        safety_rating: safety,
        comment
      });

      if (res.success) {
        notifySuccess('Thank you! Your review has been submitted.');
        onReviewSubmitted?.();
        onClose();
      }
    } catch (err) {
      notifyError(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarPicker = ({ label, value, onChange }) => (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-xs font-semibold text-slate-700">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="p-1 focus:outline-none"
          >
            <Star
              className={`w-5 h-5 transition-transform hover:scale-110 ${
                star <= value ? 'fill-amber-400 text-amber-400' : 'fill-slate-100 text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
              Write a Verified Student Review
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 space-y-1">
            <StarPicker label="Overall Experience" value={rating} onChange={setRating} />
            <StarPicker label="Cleanliness & Hygiene" value={cleanliness} onChange={setCleanliness} />
            <StarPicker label="Food & Mess Taste" value={food} onChange={setFood} />
            <StarPicker label="Security & Warden Support" value={safety} onChange={setSafety} />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Your Honest Review
            </label>
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell other students about the Wi-Fi speed, warden cooperation, food menu, and surroundings..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>Publish Review</span>
          </button>

        </form>

      </div>
    </div>
  );
};
