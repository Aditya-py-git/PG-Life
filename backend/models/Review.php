<?php
require_once __DIR__ . '/../config/Database.php';

class Review {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getByProperty(int $propertyId): array {
        $sql = "SELECT r.*, u.name as user_name, u.avatar as user_avatar, u.college_or_company
                FROM reviews r
                JOIN users u ON r.user_id = u.id
                WHERE r.property_id = ?
                ORDER BY r.id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$propertyId]);
        return $stmt->fetchAll();
    }

    public function create(int $userId, array $data): int {
        $sql = "INSERT INTO reviews (property_id, user_id, rating, cleanliness_rating, food_rating, safety_rating, comment)
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['property_id'],
            $userId,
            $data['rating'],
            $data['cleanliness_rating'] ?? 5,
            $data['food_rating'] ?? 5,
            $data['safety_rating'] ?? 5,
            $data['comment']
        ]);

        $reviewId = (int) $this->db->lastInsertId();

        // Recalculate average rating & total reviews for the property
        $this->updatePropertyRatingAverage((int)$data['property_id']);

        return $reviewId;
    }

    private function updatePropertyRatingAverage(int $propertyId): void {
        $stmt = $this->db->prepare("SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE property_id = ?");
        $stmt->execute([$propertyId]);
        $stats = $stmt->fetch();

        if ($stats) {
            $avg = round((float) $stats['avg_rating'], 2);
            $count = (int) $stats['count'];
            $upd = $this->db->prepare("UPDATE properties SET rating = ?, total_reviews = ? WHERE id = ?");
            $upd->execute([$avg, $count, $propertyId]);
        }
    }
}
