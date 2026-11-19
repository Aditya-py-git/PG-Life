import React from 'react';
import {
  Wifi,
  AirVent,
  Tv,
  Zap,
  Droplets,
  ShieldCheck,
  Fingerprint,
  Shirt,
  Utensils,
  Sparkles,
  Dumbbell,
  Flame,
  Refrigerator,
  Archive,
  Bath,
  Sun,
  Car,
  CheckCircle2
} from 'lucide-react';
import { AMENITIES_CATALOG } from '../../utils/constants';

const ICON_MAP = {
  wifi: Wifi,
  ac: AirVent,
  tv: Tv,
  power_backup: Zap,
  ro_water: Droplets,
  cctv: ShieldCheck,
  biometric_entry: Fingerprint,
  laundry: Shirt,
  cook_mess: Utensils,
  housekeeping: Sparkles,
  gym: Dumbbell,
  geyser: Flame,
  refrigerator: Refrigerator,
  wardrobe: Archive,
  attached_washroom: Bath,
  balcony: Sun,
  parking: Car,
};

export const AmenityIcon = ({ amenityKey, className = "w-4 h-4", showLabel = false, labelClass = "text-xs text-slate-600" }) => {
  const IconComponent = ICON_MAP[amenityKey] || CheckCircle2;
  const meta = AMENITIES_CATALOG[amenityKey] || { label: amenityKey.replace('_', ' ') };

  if (!showLabel) {
    return <IconComponent className={className} title={meta.label} />;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="p-2 rounded-lg bg-slate-100 text-slate-700">
        <IconComponent className={className} />
      </div>
      <span className={labelClass}>{meta.label}</span>
    </div>
  );
};
