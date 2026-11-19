import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Heart,
  ShieldCheck,
  Calendar,
  Utensils,
  Clock,
  Sparkles,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Phone,
  Mail,
  User,
  Star,
  Info,
  ChevronRight,
  Plus
} from 'lucide-react';
import { api } from '../api/client';
import { formatCurrency, formatDate, getGenderBadge } from '../utils/formatters';
import { RatingStars } from '../components/common/RatingStars';
import { AmenityIcon } from '../components/common/AmenityIcon';
import { RoomCard } from '../components/property/RoomCard';
import { BookingModal } from '../components/booking/BookingModal';
import { VisitModal } from '../components/booking/VisitModal';
import { ReviewModal } from '../components/property/ReviewModal';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import { AMENITIES_CATALOG } from '../utils/constants';

export const PropertyDetailPage = ({ propertyId, onBack, onNavigateExplore }) => {
  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [activePhoto, setActivePhoto] = useState(0);

  // Modals
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isVisitOpen, setIsVisitOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { notifySuccess, notifyInfo } = useNotification();

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.properties.getById(propertyId);
        if (res.success && res.data?.property) {
          setProperty(res.data.property);
          if (res.data.property.rooms?.length > 0) {
            setSelectedRoom(res.data.property.rooms[0]);
          }
        }

        // Fetch reviews
        const revRes = await api.reviews.getByProperty(propertyId);
        if (revRes.success && revRes.data?.reviews) {
          setReviews(revRes.data.reviews);
        }
      } catch (err) {
        console.warn('Error loading property details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchDetails();
    }
  }, [propertyId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="h-96 bg-slate-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h3 className="text-2xl font-bold text-slate-800">Property not found</h3>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-sm"
        >
          Back to Listings
        </button>
      </div>
    );
  }

  const isSaved = isInWishlist(property.id);
  const gender = getGenderBadge(property.gender_type);
  const images = property.images?.length > 0
    ? property.images
    : [{ image_url: property.cover_image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80' }];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm transition-all hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              notifySuccess('Link copied to clipboard!');
            }}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm transition-all"
            title="Share Property"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleWishlist(property)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-rose-50 hover:border-rose-200 shadow-sm transition-all"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
            <span>{isSaved ? 'Shortlisted' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Title & Key Highlights Bar */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-sm ${gender.className}`}>
            {gender.label}
          </span>
          {Boolean(Number(property.is_verified)) && (
            <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Host & Property
            </span>
          )}
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            Notice: {property.notice_period_days || 30} Days
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {property.title}
        </h1>

        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1 text-slate-700">
            <MapPin className="w-4 h-4 text-brand-600" />
            <span>{property.address}, {property.locality}, {property.city} - {property.pincode}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RatingStars rating={property.rating} reviewCount={property.total_reviews} />
          </div>
        </div>
      </div>

      {/* PHOTO GALLERY (Hero + Thumbnails) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main Big Photo */}
        <div className="lg:col-span-8 aspect-[16/10] rounded-3xl overflow-hidden bg-slate-100 shadow-lg border border-slate-200/80">
          <img
            src={images[activePhoto]?.image_url || images[0].image_url}
            alt={property.title}
            className="w-full h-full object-cover transition-all duration-300"
          />
        </div>

        {/* Thumbnail Stack */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-3 max-h-[460px] overflow-y-auto pr-1">
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActivePhoto(idx)}
              className={`relative aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                activePhoto === idx ? 'border-brand-600 ring-2 ring-brand-500/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <img
                src={img.image_url}
                alt={img.caption || `Photo ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              {img.caption && (
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  {img.caption}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main 2-Column Split: Content & Sticky Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column (Details, Rooms, Amenities, Rules, Reviews) */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 rounded-3xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Curfew Time</span>
                <p className="text-xs font-bold text-slate-900">{property.gate_closing_time || '10:30 PM'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Meals Policy</span>
                <p className="text-xs font-bold text-slate-900 capitalize">{property.food_type || 'Both Veg & Non-Veg'}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400">Security</span>
                <p className="text-xs font-bold text-slate-900">Biometric & CCTV</p>
              </div>
            </div>
          </div>

          {/* About this PG */}
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-3">About this Accommodation</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* ROOM OPTIONS (Select Room Category) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Room Categories & Bed Availability</h3>
                <p className="text-xs text-slate-500">Select a room type to calculate deposit and instant rent</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {property.rooms?.map((room) => (
                <RoomCard
                  key={room.id}
                  room={room}
                  isSelected={selectedRoom?.id === room.id}
                  onSelect={setSelectedRoom}
                />
              ))}
            </div>
          </div>

          {/* AMENITIES MATRIX */}
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-4">Amenities & Included Facilities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.amenities?.map((key) => {
                const item = AMENITIES_CATALOG[key] || { label: key.replace('_', ' ') };
                return (
                  <div
                    key={key}
                    className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/80 shadow-sm"
                  >
                    <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
                      <AmenityIcon amenityKey={key} className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* HOUSE RULES & POLICIES */}
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-4">House Rules & Resident Code</h3>
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
              {property.rules && property.rules.length > 0 ? (
                property.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs font-semibold text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">Standard community guidelines apply. Visitors allowed in common area till 9 PM.</p>
              )}
            </div>
          </div>

          {/* HOST / OWNER CARD */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-50/50 to-indigo-50/50 border border-brand-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={property.owner_avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'}
                alt={property.owner_name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/30"
              />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-700 block">Verified Property Host</span>
                <h4 className="text-base font-extrabold text-slate-900">{property.owner_name}</h4>
                <p className="text-xs text-slate-500">{property.owner_company || 'Property Caretaker & Management'}</p>
              </div>
            </div>

            <button
              onClick={() => setIsVisitOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white border border-brand-300 text-brand-700 text-xs font-bold shadow-sm hover:bg-brand-50 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Schedule Visit with Host
            </button>
          </div>

          {/* VERIFIED STUDENT REVIEWS */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900">Student Reviews & Ratings</h3>
                <div className="flex items-center gap-2 mt-1">
                  <RatingStars rating={property.rating} reviewCount={property.total_reviews} size="w-4 h-4" />
                  <span className="text-xs text-slate-500">• 100% Verified Residents</span>
                </div>
              </div>

              <button
                onClick={() => setIsReviewOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Write a Review
              </button>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={rev.user_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                          alt={rev.user_name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900">{rev.user_name}</h5>
                          <p className="text-[10px] text-slate-400">{rev.college_or_company || 'Verified Resident'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <RatingStars rating={rev.rating} showNumber={false} size="w-3.5 h-3.5" />
                        <span className="text-[10px] text-slate-400">{formatDate(rev.created_at)}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    <div className="flex gap-4 pt-2 border-t border-slate-100 text-[10px] font-semibold text-slate-500">
                      <span>Cleanliness: <strong className="text-slate-800">{rev.cleanliness_rating}/5</strong></span>
                      <span>Food: <strong className="text-slate-800">{rev.food_rating}/5</strong></span>
                      <span>Safety: <strong className="text-slate-800">{rev.safety_rating}/5</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 p-6 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
                Be the first verified resident to leave a review for this property!
              </div>
            )}
          </div>

        </div>

        {/* Right Sticky Booking Box */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="p-6 rounded-3xl bg-white border-2 border-brand-500/20 shadow-xl shadow-brand-900/5 space-y-5">
            
            {/* Price Header */}
            <div className="flex items-baseline justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Rent</span>
                <div className="text-3xl font-black text-slate-900">
                  {formatCurrency(selectedRoom ? selectedRoom.monthly_rent : property.starting_price)}
                  <span className="text-xs font-normal text-slate-500"> /month</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Zero Brokerage
                </span>
              </div>
            </div>

            {/* Room Summary Selected */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Selected Accommodation:</span>
              <p className="font-bold text-slate-900 text-sm">
                {selectedRoom ? selectedRoom.title : 'Standard Room'}
              </p>
              <p className="text-slate-500">
                Refundable Deposit: <strong>{formatCurrency(selectedRoom?.security_deposit || property.security_deposit)}</strong>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2.5">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-sm shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Instant Bed Booking</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsVisitOpen(true)}
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-brand-600" />
                <span>Schedule In-Person / Virtual Visit</span>
              </button>
            </div>

            {/* Reassurance points */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Direct booking without middleman charges</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Free cancellation up to 48h before check-in</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Instant payment receipt & student pass generated</span>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* MODALS */}
      <BookingModal
        property={property}
        selectedRoom={selectedRoom}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

      <VisitModal
        property={property}
        isOpen={isVisitOpen}
        onClose={() => setIsVisitOpen(false)}
      />

      <ReviewModal
        property={property}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onReviewSubmitted={() => {
          // Re-fetch reviews
          api.reviews.getByProperty(propertyId).then((res) => {
            if (res.success && res.data?.reviews) setReviews(res.data.reviews);
          });
        }}
      />

    </div>
  );
};
