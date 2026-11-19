<?php
require_once __DIR__ . '/../config/Config.php';

/**
 * Pure PHP HS256 JSON Web Token (JWT) Implementation
 */
class JWT {
    public static function encode(array $payload, int $expirySeconds = null): string {
        $expiry = $expirySeconds ?? Config::JWT_EXPIRY;
        $header = ['typ' => 'JWT', 'alg' => 'HS256'];
        
        $payload['iat'] = time();
        $payload['exp'] = time() + $expiry;

        $base64Header = self::base64UrlEncode(json_encode($header));
        $base64Payload = self::base64UrlEncode(json_encode($payload));

        $signature = hash_hmac('sha256', "$base64Header.$base64Payload", Config::getJwtSecret(), true);
        $base64Signature = self::base64UrlEncode($signature);

        return "$base64Header.$base64Payload.$base64Signature";
    }

    public static function decode(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return null;
        }

        [$base64Header, $base64Payload, $base64Signature] = $parts;

        // Verify signature
        $expectedSignature = hash_hmac('sha256', "$base64Header.$base64Payload", Config::getJwtSecret(), true);
        $expectedBase64Signature = self::base64UrlEncode($expectedSignature);

        if (!hash_equals($expectedBase64Signature, $base64Signature)) {
            return null;
        }

        $payload = json_decode(self::base64UrlDecode($base64Payload), true);
        if (!$payload || !isset($payload['exp'])) {
            return null;
        }

        // Check expiration
        if (time() > $payload['exp']) {
            return null;
        }

        return $payload;
    }

    private static function base64UrlEncode(string $data): string {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode(string $data): string {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}
