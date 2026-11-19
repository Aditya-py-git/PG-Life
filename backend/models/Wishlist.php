<?php
require_once __DIR__ . '/../config/Database.php';

class Wishlist {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getByUser(int $userId): array {
        $sql = "SELECT p.*, 
                       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_cover = 1 LIMIT 1) as cover_image
                FROM wishlists w
                JOIN properties p ON w.property_id = p.id
                WHERE w.user_id = ?
                ORDER BY w.id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        $props = $stmt->fetchAll();

        require_once __DIR__ . '/Property.php';
        $propModel = new Property();
        foreach ($props as &$p) {
            $p['amenities'] = $propModel->getPropertyAmenities((int)$p['id']);
        }
        return $props;
    }

    public function getUserWishlistIds(int $userId): array {
        $stmt = $this->db->prepare("SELECT property_id FROM wishlists WHERE user_id = ?");
        $stmt->execute([$userId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function toggle(int $userId, int $propertyId): bool {
        $stmt = $this->db->prepare("SELECT id FROM wishlists WHERE user_id = ? AND property_id = ?");
        $stmt->execute([$userId, $propertyId]);

        if ($stmt->fetch()) {
            // Remove
            $del = $this->db->prepare("DELETE FROM wishlists WHERE user_id = ? AND property_id = ?");
            $del->execute([$userId, $propertyId]);
            return false; // Removed
        } else {
            // Add
            $ins = $this->db->prepare("INSERT INTO wishlists (user_id, property_id) VALUES (?, ?)");
            $ins->execute([$userId, $propertyId]);
            return true; // Added
        }
    }
}
