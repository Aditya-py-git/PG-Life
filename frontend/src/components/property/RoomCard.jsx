import React from 'react';
import { Bed, Bath, Wind, Sun, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const RoomCard = ({ room, isSelected, onSelect }) => {
  const isAvailable = room.available_beds > 0;
  const isLowAvailability = room.available_beds === 1;

  return (
    <div
      onClick={() => isAvailable && onSelect(room)}
      className={`relative p-5 rounded-3xl border-2 transition-all cursor-pointer ${
        isSelected
          ? 'border-brand-600 bg-brand-50/50 shadow-md ring-2 ring-brand-500/20'
          : isAvailable
          ? 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
          : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
      }`}
    >
      {/* Selection Checkmark */}
      {isSelected && (
        <div className="absolute top-4 right-4 text-brand-600">
          <CheckCircle2 className="w-6 h-6 fill-brand-600 text-white" />
        </div>
      )}

      {/* Room Title & Sharing */}
      <div className="pr-8">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-brand-100/70 px-2.5 py-1 rounded-md">
          {room.room_type.replace('_', ' ')} Sharing
        </span>
        <h4 className="text-base font-extrabold text-slate-900 mt-2">
          {room.title}
        </h4>
      </div>

      {/* Feature Badges */}
      <div className="flex flex-wrap gap-2 mt-3">
        {Boolean(Number(room.has_ac)) && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/60">
            <Wind className="w-3 h-3" /> AC
          </span>
        )}
        {Boolean(Number(room.has_attached_bathroom)) && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
            <Bath className="w-3 h-3" /> Attached Bath
          </span>
        )}
        {Boolean(Number(room.has_balcony)) && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
            <Sun className="w-3 h-3" /> Balcony
          </span>
        )}
      </div>

      {/* Bed Availability Status */}
      <div className="mt-4 flex items-center justify-between text-xs font-semibold">
        <div className="flex items-center gap-1.5">
          <Bed className="w-4 h-4 text-slate-500" />
          {isAvailable ? (
            <span className={isLowAvailability ? 'text-rose-600 font-bold' : 'text-slate-600'}>
              {room.available_beds} of {room.total_beds} beds available
            </span>
          ) : (
            <span className="text-rose-600 font-bold">Sold Out</span>
          )}
        </div>
        {isLowAvailability && (
          <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full animate-pulse">
            Only 1 bed left!
          </span>
        )}
      </div>

      {/* Price Section */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-end justify-between">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase">Monthly Rent</span>
          <div className="text-lg font-extrabold text-slate-900">
            {formatCurrency(room.monthly_rent)}
            <span className="text-xs font-normal text-slate-500"> /bed</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-slate-400 block font-medium">Security Deposit</span>
          <span className="text-xs font-bold text-slate-700">
            {formatCurrency(room.security_deposit)}
          </span>
        </div>
      </div>

    </div>
  );
};
