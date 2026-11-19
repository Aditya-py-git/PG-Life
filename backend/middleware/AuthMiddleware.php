<?php
require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../config/Response.php';

/**
 * Authentication & Role Authorization Middleware
 */
class AuthMiddleware {
    public static function authenticate(): ?array {
        $headers = self::getRequestHeaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return null;
        }

        $token = $matches[1];
        $payload = JWT::decode($token);

        if (!$payload || !isset($payload['user_id'])) {
            return null;
        }

        return $payload;
    }

    public static function requireAuth(): array {
        $user = self::authenticate();
        if (!$user) {
            Response::unauthorized('Invalid or expired authentication token. Please log in.');
        }
        return $user;
    }

    public static function requireRole(string $role): array {
        $user = self::requireAuth();
        if ($user['role'] !== $role && $user['role'] !== 'admin') {
            Response::forbidden("Access restricted to {$role}s only.");
        }
        return $user;
    }

    private static function getRequestHeaders(): array {
        if (function_exists('apache_request_headers')) {
            return apache_request_headers();
        }
        $headers = [];
        foreach ($_SERVER as $key => $val) {
            if (str_starts_with($key, 'HTTP_')) {
                $header = str_replace(' ', '-', ucwords(str_replace('_', ' ', strtolower(substr($key, 5)))));
                $headers[$header] = $val;
            }
        }
        return $headers;
    }
}
