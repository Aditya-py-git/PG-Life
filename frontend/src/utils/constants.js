export const CITIES = [
  {
    name: 'Bangalore',
    tagline: 'Silicon Valley of India',
    image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=600&q=80',
    popularLocalities: ['Koramangala', 'Indiranagar', 'HSR Layout', 'Whitefield', 'Electronic City']
  },
  {
    name: 'Delhi',
    tagline: 'University Hub & North Campus',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80',
    popularLocalities: ['North Campus', 'Hudson Lane', 'Satya Niketan', 'Laxmi Nagar', 'Hauz Khas']
  },
  {
    name: 'Mumbai',
    tagline: 'City of Dreams & IIT Powai',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80',
    popularLocalities: ['Powai', 'Andheri West', 'Bandra', 'Vile Parle', 'Navi Mumbai']
  },
  {
    name: 'Pune',
    tagline: 'Oxford of the East & Hinjewadi',
    image: 'https://images.unsplash.com/photo-1627916607164-7b20241db935?auto=format&fit=crop&w=600&q=80',
    popularLocalities: ['Hinjewadi', 'Viman Nagar', 'Kothrud', 'Baner', 'Wakad']
  },
  {
    name: 'Hyderabad',
    tagline: 'Cyberabad & HITEC City',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80',
    popularLocalities: ['Gachibowli', 'Madhapur', 'Kondapur', 'Ameerpet', 'Kukatpally']
  }
];

export const AMENITIES_CATALOG = {
  wifi: { label: 'High-Speed Wi-Fi (300 Mbps)', icon: 'Wifi', category: 'Connectivity' },
  ac: { label: 'Air Conditioner', icon: 'AirVent', category: 'Comfort' },
  tv: { label: 'Smart LED TV', icon: 'Tv', category: 'Entertainment' },
  power_backup: { label: '24/7 Power Backup', icon: 'Zap', category: 'Essential' },
  ro_water: { label: 'Pure RO Drinking Water', icon: 'Droplets', category: 'Essential' },
  cctv: { label: '24/7 CCTV Surveillance', icon: 'ShieldCheck', category: 'Safety' },
  biometric_entry: { label: 'Biometric Access Control', icon: 'Fingerprint', category: 'Safety' },
  laundry: { label: 'Automated Washing Machines', icon: 'Shirt', category: 'Convenience' },
  cook_mess: { label: '3-Time Chef Cooked Meals', icon: 'Utensils', category: 'Food' },
  housekeeping: { label: 'Daily Room Housekeeping', icon: 'Sparkles', category: 'Cleanliness' },
  gym: { label: 'Fitness Center / Gym', icon: 'Dumbbell', category: 'Fitness' },
  geyser: { label: 'Hot Water Geyser', icon: 'Flame', category: 'Comfort' },
  refrigerator: { label: 'Refrigerator', icon: 'Refrigerator', category: 'Kitchen' },
  wardrobe: { label: 'Spacious Wooden Wardrobe', icon: 'Archive', category: 'Furniture' },
  attached_washroom: { label: 'Attached Ensuite Washroom', icon: 'Bath', category: 'Privacy' },
  balcony: { label: 'Private Balcony', icon: 'Sun', category: 'Comfort' },
  parking: { label: 'Two & Four Wheeler Parking', icon: 'Car', category: 'Convenience' },
};

export const GENDER_TYPES = [
  { value: 'all', label: 'All PGs' },
  { value: 'unisex', label: 'Co-Living / Unisex' },
  { value: 'female', label: 'Girls Only' },
  { value: 'male', label: 'Boys Only' }
];

export const ROOM_TYPES = [
  { value: 'all', label: 'All Room Types' },
  { value: 'single', label: 'Single (Private Room)' },
  { value: 'double', label: 'Double (2 Sharing)' },
  { value: 'triple', label: 'Triple (3 Sharing)' }
];

export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured & Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Listed' }
];

export const DEMO_ACCOUNTS = {
  student: {
    email: 'rahul@student.pglife.com',
    password: 'password123',
    name: 'Rahul Sharma',
    role: 'student',
    label: 'Demo Student'
  },
  owner: {
    email: 'vikram@owner.pglife.com',
    password: 'password123',
    name: 'Vikram Malhotra',
    role: 'owner',
    label: 'Demo PG Owner'
  }
};
