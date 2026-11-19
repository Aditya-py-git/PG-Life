import React from 'react';
import { MapPin, Heart, ShieldCheck, Utensils, ArrowRight, Eye, Calendar } from 'lucide-react';
import { formatCurrency, getGenderBadge } from '../../utils/formatters';
import { RatingStars } from '../common/RatingStars';
import { AmenityIcon } from '../common/AmenityIcon';
import { useWishlist } from '../../context/WishlistContext';

export const PropertyCard = ({ property, onSelect, onScheduleVisit }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(property.id);
  const gender = getGenderBadge(property.gender_type);

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 cursor-pointer" onClick={() => onSelect(property)}>
        <img
          src={property.cover_image || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border shadow-sm backdrop-blur-md ${gender.className}`}>
            {gender.label}
          </span>
          {Boolean(Number(property.is_verified)) && (
            <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(property);
          }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-slate-700 hover:scale-110 active:scale-95 transition-all"
          title={isSaved ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Heart className={`w-4 h-4 transition-colors ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-600'}`} />
        </button>

        {/* Food Badge */}
        {Boolean(Number(property.food_available)) && (
          <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1.5">
            <Utensils className="w-3 h-3 text-amber-400" />
            <span>Meals Included</span>
          </div>
        )}
      </div>

      {/* Body Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Rating */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1 text-slate-500 text-xs font-semibold truncate">
              <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
              <span className="truncate">{property.locality}, {property.city}</span>
            </div>
            <RatingStars
              rating={property.rating}
              reviewCount={property.total_reviews}
              size="w-3.5 h-3.5"
            />
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(property)}
            className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {property.title}
          </h3>

          {/* Amenities Mini List */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-3">
            {property.amenities?.slice(0, 4).map((key) => (
              <div 
                key={key} 
                className="flex items-center gap-1 text-slate-600 text-xs font-medium"
              >
                <AmenityIcon amenityKey={key} className="w-3.5 h-3.5 text-slate-500" />
                <span className="capitalize text-[11px] hidden sm:inline">{key.replace('_', ' ')}</span>
              </div>
            ))}
            {(property.amenities?.length || 0) > 4 && (
              <span className="text-[11px] font-bold text-brand-600">
                +{property.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">Starts from</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-extrabold text-slate-900">
                {formatCurrency(property.starting_price)}
              </span>
              <span className="text-xs text-slate-500 font-medium">/mo</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onScheduleVisit?.(property)}
              className="p-2.5 rounded-xl border border-slate-200 text-slate-700 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-200 transition-all"
              title="Schedule a Visit"
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSelect(property)}
              className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white text-xs font-bold transition-all shadow-sm group-hover:shadow"
            >
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
