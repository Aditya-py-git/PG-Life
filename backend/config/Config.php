<?php
/**
 * PG-Life Platform Configuration
 */
class Config {
    // Database Configuration
    const DB_HOST = '127.0.0.1';
    const DB_PORT = '3306';
    const DB_NAME = 'pg_life';
    const DB_USER = 'root';
    const DB_PASS = '';
    const DB_CHARSET = 'utf8mb4';

    // Application Configuration
    const APP_NAME = 'PG-Life';
    const APP_ENV = 'development'; // development | production
    const APP_URL = 'http://localhost:8000';
    const CLIENT_URL = 'http://localhost:5173';

    // Security & JWT
    const JWT_EXPIRY = 604800; // 7 days in seconds
    const BCRYPT_ROUNDS = 10;

    public static function getJwtSecret(): string {
        $secret = getenv('JWT_SECRET');
        if ($secret === false || $secret === '') {
            throw new RuntimeException('JWT_SECRET environment variable must be set.');
        }

        return $secret;
    }

    // Uploads
    const UPLOAD_DIR = __DIR__ . '/../public/uploads/';
    const MAX_UPLOAD_SIZE = 5242880; // 5MB
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
}
