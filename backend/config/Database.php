<?php
require_once __DIR__ . '/Config.php';

/**
 * Robust Database Connection Manager (PDO)
 * Automatically connects to MySQL, initializes database/tables if needed,
 * and seamlessly provides SQLite fallback if MySQL server is offline.
 */
class Database {
    private static ?PDO $instance = null;
    private static string $driver = 'mysql';

    public static function getConnection(): PDO {
        if (self::$instance !== null) {
            return self::$instance;
        }

        // 1. Try MySQL First
        try {
            $dsnNoDb = sprintf(
                'mysql:host=%s;port=%s;charset=%s',
                Config::DB_HOST,
                Config::DB_PORT,
                Config::DB_CHARSET
            );
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::ATTR_TIMEOUT => 2
            ];

            $pdoCheck = new PDO($dsnNoDb, Config::DB_USER, Config::DB_PASS, $options);
            
            // Check / Create Database if not exists
            $pdoCheck->exec("CREATE DATABASE IF NOT EXISTS `" . Config::DB_NAME . "` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");

            $dsnWithDb = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                Config::DB_HOST,
                Config::DB_PORT,
                Config::DB_NAME,
                Config::DB_CHARSET
            );

            self::$instance = new PDO($dsnWithDb, Config::DB_USER, Config::DB_PASS, $options);
            self::$driver = 'mysql';

            // Check if tables exist, if not auto-initialize
            self::checkAndAutoSeedMySQL(self::$instance);

            return self::$instance;
        } catch (Throwable $e) {
            error_log("MySQL connection failed: " . $e->getMessage() . ". Falling back to SQLite for seamless operation.");
        }

        // 2. Fallback to SQLite
        try {
            $sqlitePath = __DIR__ . '/../database/pg_life.sqlite';
            $isNew = !file_exists($sqlitePath);
            self::$instance = new PDO('sqlite:' . $sqlitePath, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            self::$instance->exec('PRAGMA foreign_keys = ON;');
            self::$driver = 'sqlite';

            if ($isNew || filesize($sqlitePath) < 100) {
                self::initSQLiteDatabase(self::$instance);
            }

            return self::$instance;
        } catch (Throwable $e) {
            throw new Exception("Critical Database Failure: Unable to connect to MySQL or initialize SQLite fallback. " . $e->getMessage());
        }
    }

    public static function getDriver(): string {
        return self::$driver;
    }

    private static function checkAndAutoSeedMySQL(PDO $pdo): void {
        try {
            $stmt = $pdo->query("SHOW TABLES LIKE 'properties'");
            if ($stmt->rowCount() === 0) {
                $schemaFile = __DIR__ . '/../database/schema.sql';
                $seedFile = __DIR__ . '/../database/seed.sql';
                if (file_exists($schemaFile)) {
                    $pdo->exec(file_get_contents($schemaFile));
                }
                if (file_exists($seedFile)) {
                    $pdo->exec(file_get_contents($seedFile));
                }
            }
        } catch (Throwable $e) {
            error_log("Auto seed MySQL warning: " . $e->getMessage());
        }
    }

    private static function initSQLiteDatabase(PDO $pdo): void {
        $sqliteSchema = <<<SQL
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    phone TEXT DEFAULT NULL,
    role TEXT DEFAULT 'student',
    college_or_company TEXT DEFAULT NULL,
    avatar TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    owner_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    gender_type TEXT DEFAULT 'unisex',
    address TEXT NOT NULL,
    locality TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT DEFAULT 'Karnataka',
    pincode TEXT NOT NULL,
    latitude REAL DEFAULT 12.9716,
    longitude REAL DEFAULT 77.5946,
    starting_price REAL NOT NULL,
    security_deposit REAL NOT NULL,
    notice_period_days INTEGER DEFAULT 30,
    gate_closing_time TEXT DEFAULT '10:30 PM',
    food_available INTEGER DEFAULT 1,
    food_type TEXT DEFAULT 'both',
    is_verified INTEGER DEFAULT 1,
    is_featured INTEGER DEFAULT 0,
    rating REAL DEFAULT 4.50,
    total_reviews INTEGER DEFAULT 0,
    rules TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    image_url TEXT NOT NULL,
    is_cover INTEGER DEFAULT 0,
    caption TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS property_amenities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    amenity_key TEXT NOT NULL,
    UNIQUE (property_id, amenity_key),
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    room_type TEXT NOT NULL,
    title TEXT NOT NULL,
    monthly_rent REAL NOT NULL,
    security_deposit REAL NOT NULL,
    total_beds INTEGER NOT NULL DEFAULT 1,
    available_beds INTEGER NOT NULL DEFAULT 1,
    has_ac INTEGER DEFAULT 1,
    has_attached_bathroom INTEGER DEFAULT 1,
    has_balcony INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    booking_code TEXT NOT NULL UNIQUE,
    user_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    room_id INTEGER NOT NULL,
    check_in_date TEXT NOT NULL,
    stay_duration_months INTEGER DEFAULT 6,
    monthly_rent REAL NOT NULL,
    security_deposit REAL NOT NULL,
    total_initial_amount REAL NOT NULL,
    booking_status TEXT DEFAULT 'confirmed',
    payment_status TEXT DEFAULT 'paid',
    payment_method TEXT DEFAULT 'UPI',
    transaction_id TEXT DEFAULT NULL,
    special_requests TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    visit_date TEXT NOT NULL,
    time_slot TEXT NOT NULL,
    visit_type TEXT DEFAULT 'in_person',
    status TEXT DEFAULT 'scheduled',
    notes TEXT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    cleanliness_rating INTEGER DEFAULT 5,
    food_rating INTEGER DEFAULT 5,
    safety_rating INTEGER DEFAULT 5,
    comment TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS wishlists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, property_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    property_id INTEGER NOT NULL,
    category TEXT DEFAULT 'other',
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT DEFAULT 'open',
    priority TEXT DEFAULT 'medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);
SQL;
        $pdo->exec($sqliteSchema);

        // Also run seeder for SQLite
        require_once __DIR__ . '/../database/seed_helper.php';
        SeedHelper::runSeed($pdo);
    }
}
