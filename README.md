# PG-Life — Production-Ready Student & Co-Living Accommodation Booking Platform

PG-Life is an enterprise-grade full-stack accommodation booking platform tailored for students, interns, and young working professionals seeking verified paying-guest (PG) and co-living housing across major Indian tech and educational hubs (Bangalore, Delhi, Mumbai, Pune, Hyderabad).

---

## 1. Technology Stack & Architecture

```
Frontend (React 18 + Tailwind CSS + Lucide Icons)
       │
       │  REST API (JSON Envelopes + Bearer JWT Tokens + CORS)
       ▼
Backend (PHP 8.2 MVC Architecture)
       │
       │  PDO (Prepared Statements)
       ▼
Database (MySQL Database with resilient SQLite auto-fallback)
```

- **Frontend**:
  - React 18 (Hooks, Context API, Modular Components)
  - Vite 5 (High-speed HMR build tool)
  - Tailwind CSS 3 (Utility-first styling with custom brand color palette)
  - Lucide React (Crisp modern SVG icons)
  - Responsive Mobile-first UX inspired by Airbnb and Stanza Living

- **Backend**:
  - PHP 8.2+ RESTful API following MVC separation of concerns
  - Pure PHP JWT Authentication (`HS256`, zero bloat)
  - PDO Database Abstraction with UTF-8mb4 character set & prepared statements
  - Auto Database Discovery & Resilience: connects directly to MySQL (`pg_life` database), and provides zero-friction automatic fallback to SQLite if MySQL service is temporarily offline
  - Structured error handling, input validation, and sanitized JSON responses

- **Database**:
  - MySQL 5.7+ / 8.0+ schema (`backend/database/schema.sql`)
  - Normalized relational tables: `users`, `properties`, `property_images`, `property_amenities`, `rooms`, `bookings`, `visits`, `reviews`, `wishlists`, `complaints`
  - Automated seeding script with real-world student cities, photos, amenities, and pricing

---

## 2. Directory Structure

```
PG-Life/
├── backend/
│   ├── config/
│   │   ├── Config.php            # Environment constants & JWT secrets
│   │   ├── Database.php          # PDO connection singleton (MySQL + SQLite)
│   │   └── Response.php          # Standard JSON API envelopes
│   ├── controllers/
│   │   ├── AuthController.php    # Student & Owner registration and login
│   │   ├── PropertyController.php# Filter, search, and property management
│   │   ├── BookingController.php # Room reservations and invoice status
│   │   ├── VisitController.php   # Physical and virtual tour appointments
│   │   ├── ReviewController.php  # Verified student reviews and rating summaries
│   │   ├── WishlistController.php# Shortlisted properties
│   │   ├── ComplaintController.php # Maintenance ticketing desk
│   │   └── StatsController.php   # Host revenue and occupancy analytics
│   ├── models/
│   │   ├── User.php
│   │   ├── Property.php
│   │   ├── Room.php
│   │   ├── Booking.php
│   │   ├── Visit.php
│   │   ├── Review.php
│   │   ├── Wishlist.php
│   │   └── Complaint.php
│   ├── middleware/
│   │   ├── AuthMiddleware.php    # JWT token validation & role authorization
│   │   └── CorsMiddleware.php    # CORS preflight & headers
│   ├── utils/
│   │   ├── JWT.php               # HMAC-SHA256 token encoder/decoder
│   │   └── Validator.php         # Request sanitation and validation
│   ├── database/
│   │   ├── schema.sql            # MySQL DDL tables
│   │   ├── seed.sql              # Realistic seed data
│   │   ├── seed_helper.php       # Universal prepared seed inserter
│   │   └── migrate.php           # CLI and automated installer
│   ├── public/
│   │   ├── index.php             # Unified REST router & front controller
│   │   └── .htaccess             # Apache rewrite rules
│   └── .htaccess
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js         # Fetch client with Bearer auth headers
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Authentication state & 1-click demo logins
│   │   │   ├── WishlistContext.jsx # Saved favorites state
│   │   │   └── NotificationContext.jsx # Toast notifications
│   │   ├── components/
│   │   │   ├── common/           # Navbar, Footer, RatingStars, AmenityIcon
│   │   │   ├── property/         # PropertyCard, PropertyFilters, RoomCard, ReviewModal
│   │   │   ├── booking/          # BookingModal, VisitModal
│   │   │   └── owner/            # AddPropertyModal (4-step onboarding wizard)
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Hero search, top cities, featured PGs, testimonials
│   │   │   ├── PropertyListingPage.jsx # Split view filter sidebar & sorting
│   │   │   ├── PropertyDetailPage.jsx # Lightbox gallery, rooms, amenities, reviews
│   │   │   ├── StudentDashboardPage.jsx # Bookings, visits, complaints, profile
│   │   │   ├── OwnerDashboardPage.jsx # Revenue analytics, approvals, tickets
│   │   │   └── AuthModal.jsx     # Tabbed Sign In / Register with 1-click Demo buttons
│   │   ├── utils/
│   │   │   ├── constants.js      # City guides, amenity icons, demo accounts
│   │   │   └── formatters.js     # Currency (₹ INR), dates, status badges
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

---

## 3. Demo Accounts (1-Click Instant Evaluation)

The platform includes pre-seeded demo accounts in the navigation bar and authentication modal:

| Role | Name | Email | Password | Access |
|---|---|---|---|---|
| **Student** | Rahul Sharma | `rahul@student.pglife.com` | `password123` | Booking pass, visit scheduling, wishlist, tickets |
| **PG Owner** | Vikram Malhotra | `vikram@owner.pglife.com` | `password123` | Host analytics, add PG wizard, booking approvals |
| **Admin** | Admin Officer | `admin@pglife.com` | `password123` | Platform oversight |

---

## 4. How to Run Locally

### Configure the JWT signing key
Set a private signing key in the same terminal before starting the backend. In PowerShell, generate one with:
```powershell
$env:JWT_SECRET = php -r "echo bin2hex(random_bytes(32));"
```
Keep this value private and do not commit it. The backend requires `JWT_SECRET` when creating or validating authentication tokens.

### Step 1: Start the PHP Backend API
In your terminal, start the PHP server on port `8000`:
```bash
# Using PHP from XAMPP or system PATH:
C:\xampp\php\php.exe -S 127.0.0.1:8000 -t backend/public
```
The API will be live at `http://127.0.0.1:8000/api/health`.

### Step 2: Start the React Frontend
In a second terminal:
```bash
cd frontend
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 5. REST API Endpoints Reference

### Authentication
- `POST /api/auth/register` — Register student or owner account
- `POST /api/auth/login` — Login & receive JWT Bearer token
- `GET  /api/auth/me` — Authenticated profile info
- `PUT  /api/auth/profile` — Update phone, university, avatar

### Properties
- `GET  /api/properties` — Search & filter (city, gender, price, room_type, amenities, search, sort)
- `GET  /api/properties/featured` — Top handpicked PGs
- `GET  /api/properties/cities` — City counts & starting rent
- `GET  /api/properties/:id` — Full property details with rooms, amenities, reviews, host info
- `GET  /api/properties/my` — Host's listed properties
- `POST /api/properties` — Host: List new PG
- `PUT  /api/properties/:id` — Host: Update PG
- `DELETE /api/properties/:id` — Host: Delete PG
- `POST /api/properties/:id/rooms` — Host: Add room configuration

### Bookings
- `POST /api/bookings` — Student: Reserve bed with calculated deposit & first month rent
- `GET  /api/bookings/my` — Student: View confirmed and active bookings
- `GET  /api/bookings/owner` — Host: View incoming booking requests
- `PUT  /api/bookings/:id/status` — Update booking status (`confirmed`, `active`, `completed`, `cancelled`)

### Visits
- `POST /api/visits` — Student: Schedule in-person visit or 360 virtual video tour
- `GET  /api/visits/my` — Student: View scheduled inspection visits
- `GET  /api/visits/owner` — Host: View visit requests
- `PUT  /api/visits/:id/status` — Host: Accept or decline visit appointment

### Maintenance Desk
- `POST /api/complaints` — Student: Raise ticket (Wi-Fi, plumbing, electrical, cleaning, food)
- `GET  /api/complaints/my` — Student: Track ticket status
- `GET  /api/complaints/owner` — Host: Manage open complaints
- `PUT  /api/complaints/:id/status` — Host: Mark ticket as `in_progress` or `resolved`

### Reviews & Wishlist
- `GET  /api/reviews/property/:id` — Read resident reviews with sub-criteria ratings
- `POST /api/reviews` — Submit verified resident review
- `GET  /api/wishlist` — View shortlisted properties
- `POST /api/wishlist/toggle` — Add/remove property from favorites
- `GET  /api/stats/owner` — Host analytics (occupancy %, monthly revenue, vacant beds)
