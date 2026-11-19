import React from 'react';
import { Star } from 'lucide-react';

export const RatingStars = ({ rating = 0, size = "w-4 h-4", showNumber = true, reviewCount = null, className = "" }) => {
  const numericRating = Math.max(0, Math.min(5, Number(rating) || 0));

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = numericRating >= star;
          const isHalf = !isFilled && numericRating >= star - 0.5;

          return (
            <Star
              key={star}
              className={`${size} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : isHalf
                  ? 'fill-amber-400/50 text-amber-400'
                  : 'fill-slate-200 text-slate-200'
              }`}
            />
          );
        })}
      </div>

      {showNumber && (
        <span className="text-sm font-bold text-slate-800">
          {numericRating.toFixed(1)}
        </span>
      )}

      {reviewCount !== null && (
        <span className="text-xs text-slate-500 font-normal">
          ({reviewCount})
        </span>
      )}
    </div>
  );
};
