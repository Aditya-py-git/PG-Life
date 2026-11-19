-- PG-Life Seed Data (Realistic Properties, Rooms, Amenities, Reviews across top student cities)

-- USERS
-- Password for all seed users is: password123
INSERT INTO users (id, name, email, password, phone, role, college_or_company, avatar) VALUES
(1, 'Rahul Sharma', 'rahul@student.pglife.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 98765 43210', 'student', 'RV College of Engineering', 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80'),
(2, 'Ananya Iyer', 'ananya@student.pglife.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 98111 22334', 'student', 'Delhi University - North Campus', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80'),
(3, 'Vikram Malhotra', 'vikram@owner.pglife.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 98222 33445', 'owner', 'Greenfield Stays & Living Co.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'),
(4, 'Priya Kulkarni', 'priya@owner.pglife.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 98333 44556', 'owner', 'UrbanNest Hospitality Solutions', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'),
(5, 'Admin Officer', 'admin@pglife.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '+91 99999 88888', 'admin', 'PG-Life Headquarters', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- PROPERTIES
INSERT INTO properties (id, owner_id, title, slug, description, gender_type, address, locality, city, state, pincode, latitude, longitude, starting_price, security_deposit, notice_period_days, gate_closing_time, food_available, food_type, is_verified, is_featured, rating, total_reviews, rules) VALUES
(
    1, 3,
    'Stanza Cambridge Premium Co-living',
    'stanza-cambridge-premium-co-living-koramangala',
    'Experience upscale modern living situated right at the center of Koramangala 4th Block. Walking distance to Sony World Signal, premier cafes, startup hubs, and colleges. Features high-speed fiber internet, 3 times chef-curated meals, professional daily housekeeping, and vibrant community lounge with PS5 and foosball.',
    'unisex',
    'Plot 42, 80 Feet Road, 4th Block, Koramangala',
    'Koramangala',
    'Bangalore',
    'Karnataka',
    '560034',
    12.9352, 77.6245,
    9500.00, 15000.00, 30, '11:00 PM', 1, 'both', 1, 1, 4.85, 24,
    '["No smoking inside bedrooms", "Visitors allowed in common areas until 9 PM", "Quiet hours after 11 PM", "Biometric access mandatory"]'
),
(
    2, 3,
    'Serene Haven Girls PG & Residency',
    'serene-haven-girls-pg-residency-indiranagar',
    'Ultra-safe, boutique luxury stay specially tailored for female students and corporate professionals in Indiranagar. Round-the-clock female security personnel, biometric gate access, dedicated study booths, in-house laundry, and nutritious North & South Indian home-style meals.',
    'female',
    '12th Main Road, HAL 2nd Stage, Indiranagar',
    'Indiranagar',
    'Bangalore',
    'Karnataka',
    '560038',
    12.9719, 77.6412,
    11000.00, 18000.00, 30, '10:30 PM', 1, 'both', 1, 1, 4.90, 19,
    '["Female guests only inside rooms", "24/7 Security CCTV enabled", "Late entry requires prior notice via student portal", "No loud music after 10 PM"]'
),
(
    3, 4,
    'The Scholar Hub Boys PG & Suites',
    'the-scholar-hub-boys-pg-north-campus-delhi',
    'Located within 5 minutes walking distance from Delhi University North Campus (Hansraj & Hindu College). Tailored specifically for DU students with ultra-fast Wi-Fi, air-conditioned study lounges, power backup during summer, and 4 wholesome meals every day including evening snacks.',
    'male',
    'B-14, Chhatra Marg, Near Vishwavidyalaya Metro, North Campus',
    'North Campus',
    'Delhi',
    'Delhi',
    '110007',
    28.6923, 77.2104,
    8500.00, 12000.00, 30, '10:30 PM', 1, 'both', 1, 1, 4.75, 32,
    '["Smoking strictly prohibited", "Alcohol strictly prohibited", "Valid college ID required for guest entries", "Maintain library quietness in common rooms"]'
),
(
    4, 4,
    'Zenith Co-Living & Executive Suites',
    'zenith-co-living-executive-suites-powai-mumbai',
    'Modern executive living facing Powai Lake, ideal for IIT Bombay scholars and Hiranandani IT specialists. Offers soundproof rooms, private workstations, gym access, infinity rooftop café, and 24/7 tech-enabled access.',
    'unisex',
    'Central Avenue, Hiranandani Gardens, Powai',
    'Powai',
    'Mumbai',
    'Maharashtra',
    '400076',
    19.1176, 72.9060,
    14500.00, 25000.00, 45, 'No Curfew', 1, 'both', 1, 1, 4.80, 15,
    '["Keep common spaces clean", "Pet-friendly zone on 1st floor", "Biometric keycard required", "Guests allowed with advance registration"]'
),
(
    5, 3,
    'Apex Scholars PG for Boys & Girls',
    'apex-scholars-pg-hinjewadi-pune',
    'Right next to Hinjewadi Phase 1 IT Park and Symbiosis Institute. Features spacious double and triple sharing bedrooms with ergonomic chairs, high-speed fiber broadband, hot water geysers, and regular sanitization.',
    'unisex',
    'Survey 48, Phase 1, Hinjewadi Rajiv Gandhi Infotech Park',
    'Hinjewadi',
    'Pune',
    'Maharashtra',
    '411057',
    18.5913, 73.7389,
    7500.00, 10000.00, 30, '11:00 PM', 1, 'both', 1, 0, 4.60, 18,
    '["ID card mandatory", "Designated parking slots", "Electricity billed per room sub-meter", "Curfew strictly at 11 PM on weekdays"]'
),
(
    6, 4,
    'CyberCity Elite Executive PG',
    'cybercity-elite-executive-pg-gachibowli-hyderabad',
    'Premium accommodation near IIIT Hyderabad and Microsoft Campus in Gachibowli. Offers fully air-conditioned rooms, LED TVs, refrigerator on each floor, buffet-style dinner, and complimentary weekend shuttle to metro.',
    'unisex',
    'Telecom Nagar, Near DLF CyberCity, Gachibowli',
    'Gachibowli',
    'Hyderabad',
    'Telangana',
    '500032',
    17.4401, 78.3489,
    8900.00, 14000.00, 30, '11:30 PM', 1, 'both', 1, 1, 4.70, 28,
    '["Smoking only in open terrace", "Visitors must register at security reception", "Cleanliness inspections weekly"]'
)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- PROPERTY IMAGES
INSERT INTO property_images (property_id, image_url, is_cover, caption) VALUES
(1, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80', 1, 'Modern Designer Double Room'),
(1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80', 0, 'Spacious Living & Lounge'),
(1, 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80', 0, 'Attached Modern Bathroom'),
(1, 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1000&q=80', 0, 'Dining & Kitchen Facility'),

(2, 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80', 1, 'Cozy Premium Single Room'),
(2, 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80', 0, 'Study & Recreation Corner'),
(2, 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=80', 0, 'Clean Ensuite Restroom'),

(3, 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?auto=format&fit=crop&w=1200&q=80', 1, 'Airy Twin Sharing Student Room'),
(3, 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1000&q=80', 0, 'Campus View Balcony'),
(3, 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1000&q=80', 0, 'Study Library Lounge'),

(4, 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80', 1, 'Executive Suite with Lake View'),
(4, 'https://images.unsplash.com/photo-1534353436294-0dbd4bdac845?auto=format&fit=crop&w=1000&q=80', 0, 'High-End Workstation Area'),
(4, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80', 0, 'Fitness & Gym Center'),

(5, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', 1, 'Triple Sharing Budget Room'),
(5, 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=1000&q=80', 0, 'Dining & Mess Hall'),

(6, 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80', 1, 'Deluxe Tech-Park View Room'),
(6, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80', 0, 'Recreational Lounge');

-- PROPERTY AMENITIES
INSERT IGNORE INTO property_amenities (property_id, amenity_key) VALUES
(1, 'wifi'), (1, 'ac'), (1, 'tv'), (1, 'power_backup'), (1, 'ro_water'), (1, 'cctv'), (1, 'laundry'), (1, 'gym'), (1, 'housekeeping'), (1, 'cook_mess'), (1, 'biometric_entry'), (1, 'parking'),
(2, 'wifi'), (2, 'ac'), (2, 'power_backup'), (2, 'ro_water'), (2, 'cctv'), (2, 'laundry'), (2, 'housekeeping'), (2, 'cook_mess'), (2, 'biometric_entry'), (2, 'geyser'),
(3, 'wifi'), (3, 'ac'), (3, 'power_backup'), (3, 'ro_water'), (3, 'cctv'), (3, 'laundry'), (3, 'cook_mess'), (3, 'wardrobe'), (3, 'attached_washroom'),
(4, 'wifi'), (4, 'ac'), (4, 'tv'), (4, 'power_backup'), (4, 'ro_water'), (4, 'cctv'), (4, 'laundry'), (4, 'gym'), (4, 'housekeeping'), (4, 'refrigerator'), (4, 'parking'), (4, 'balcony'),
(5, 'wifi'), (5, 'power_backup'), (5, 'ro_water'), (5, 'cctv'), (5, 'housekeeping'), (5, 'cook_mess'), (5, 'parking'),
(6, 'wifi'), (6, 'ac'), (6, 'tv'), (6, 'power_backup'), (6, 'ro_water'), (6, 'cctv'), (6, 'laundry'), (6, 'gym'), (6, 'cook_mess'), (6, 'biometric_entry');

-- ROOMS
INSERT INTO rooms (id, property_id, room_type, title, monthly_rent, security_deposit, total_beds, available_beds, has_ac, has_attached_bathroom, has_balcony) VALUES
(1, 1, 'single', 'Private Executive Suite', 16500.00, 25000.00, 6, 2, 1, 1, 1),
(2, 1, 'double', 'Premium Twin Sharing Room', 11500.00, 18000.00, 16, 5, 1, 1, 0),
(3, 1, 'triple', 'Comfort Triple Sharing Room', 9500.00, 15000.00, 18, 4, 1, 1, 0),

(4, 2, 'single', 'Boutique Solo Girl Suite', 18000.00, 25000.00, 8, 1, 1, 1, 1),
(5, 2, 'double', 'Deluxe Double Sharing Room', 12500.00, 18000.00, 14, 3, 1, 1, 0),
(6, 2, 'triple', 'Standard Triple Sharing Room', 11000.00, 15000.00, 12, 4, 1, 1, 0),

(7, 3, 'single', 'Scholar Single Room', 13000.00, 18000.00, 10, 2, 1, 1, 0),
(8, 3, 'double', 'Double Sharing Academic Room', 9500.00, 14000.00, 20, 6, 1, 1, 0),
(9, 3, 'triple', 'Economy Triple Room', 8500.00, 12000.00, 15, 3, 0, 1, 0),

(10, 4, 'single', 'Master Studio Suite with Lake View', 24000.00, 35000.00, 5, 1, 1, 1, 1),
(11, 4, 'double', 'Luxury Twin Executive Room', 16500.00, 25000.00, 12, 4, 1, 1, 1),
(12, 4, 'triple', 'Co-Working Triple Suite', 14500.00, 20000.00, 9, 2, 1, 1, 0),

(13, 5, 'double', 'Standard IT Double Room', 9000.00, 12000.00, 10, 3, 0, 1, 0),
(14, 5, 'triple', 'Budget Triple Sharing Room', 7500.00, 10000.00, 18, 5, 0, 1, 0),

(15, 6, 'single', 'Silicon Valley Solo Room', 15000.00, 20000.00, 8, 2, 1, 1, 1),
(16, 6, 'double', 'Executive Cyber Twin Room', 10500.00, 15000.00, 16, 4, 1, 1, 0),
(17, 6, 'triple', 'Economy Cyber Room', 8900.00, 14000.00, 12, 3, 1, 1, 0)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- REVIEWS
INSERT INTO reviews (property_id, user_id, rating, cleanliness_rating, food_rating, safety_rating, comment, created_at) VALUES
(1, 1, 5, 5, 4, 5, 'Hands down the best PG experience I have had in Bangalore! The Wi-Fi is blazing fast for online coursework, the housekeeping staff is so polite, and the community events every Saturday make it feel like home.', '2026-10-15 14:30:00'),
(1, 2, 5, 5, 5, 5, 'Loved the food quality! They serve 4 meals with varied menus every week. Security is top notch with biometric entry.', '2026-10-22 09:15:00'),
(2, 2, 5, 5, 5, 5, 'Extremely safe and peaceful place for girls in Indiranagar. The female warden is very caring, and walking to 100ft road takes only 5 mins!', '2026-10-28 11:45:00'),
(3, 1, 4, 4, 4, 5, 'Great location for DU students. Very close to Hansraj. Power backup saved our exam preparation during voltage cuts.', '2026-10-10 18:20:00'),
(4, 1, 5, 5, 5, 5, 'Incredible view of Powai lake. Quiet ambience, ideal for working professionals and postgraduate students.', '2026-11-01 16:00:00');

-- SAMPLE BOOKINGS
INSERT INTO bookings (booking_code, user_id, property_id, room_id, check_in_date, stay_duration_months, monthly_rent, security_deposit, total_initial_amount, booking_status, payment_status, payment_method, transaction_id, special_requests) VALUES
('PGL-2026-98101', 1, 1, 2, '2026-12-01', 6, 11500.00, 18000.00, 29500.00, 'confirmed', 'paid', 'UPI', 'UPI_TXN_9872149021', 'Quiet corner bed preferred near the window.'),
('PGL-2026-98102', 2, 2, 4, '2026-11-20', 12, 18000.00, 25000.00, 43000.00, 'active', 'paid', 'Net Banking', 'NB_HDFC_88492019', 'Vegetarian food options requested.')
ON DUPLICATE KEY UPDATE booking_status=VALUES(booking_status);

-- SAMPLE VISITS
INSERT INTO visits (user_id, property_id, visit_date, time_slot, visit_type, status, notes) VALUES
(1, 4, '2026-11-12', '10:00 AM - 12:00 PM', 'in_person', 'scheduled', 'Would like to inspect the gym and lake facing balconies.'),
(2, 3, '2026-11-15', '03:00 PM - 05:00 PM', 'virtual_video_call', 'scheduled', 'Virtual tour of double sharing room and library.')
ON DUPLICATE KEY UPDATE status=VALUES(status);

-- SAMPLE WISHLISTS
INSERT IGNORE INTO wishlists (user_id, property_id) VALUES
(1, 2),
(1, 4),
(2, 1),
(2, 4);

-- SAMPLE COMPLAINTS (MAINTENANCE TICKETS)
INSERT INTO complaints (user_id, property_id, category, title, description, status, priority) VALUES
(1, 1, 'wifi', 'WiFi router 3rd floor intermittent connection', 'Speed drops between 8 PM to 10 PM on the 3rd floor hallway access point.', 'in_progress', 'medium'),
(2, 2, 'cleaning', 'Balcony glass cleaning request', 'Weekly deep cleaning needed for outer balcony panels.', 'resolved', 'low');
