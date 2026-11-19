<?php
require_once __DIR__ . '/../config/Database.php';

class Room {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function findById(int $id): ?array {
        $stmt = $this->db->prepare("SELECT * FROM rooms WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $room = $stmt->fetch();
        return $room ?: null;
    }

    public function create(int $propertyId, array $data): int {
        $sql = "INSERT INTO rooms (property_id, room_type, title, monthly_rent, security_deposit, total_beds, available_beds, has_ac, has_attached_bathroom, has_balcony) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $propertyId,
            $data['room_type'] ?? 'double',
            $data['title'] ?? 'Cozy Room',
            $data['monthly_rent'],
            $data['security_deposit'] ?? ($data['monthly_rent'] * 1.5),
            $data['total_beds'] ?? 2,
            $data['available_beds'] ?? 2,
            isset($data['has_ac']) ? (int)$data['has_ac'] : 1,
            isset($data['has_attached_bathroom']) ? (int)$data['has_attached_bathroom'] : 1,
            isset($data['has_balcony']) ? (int)$data['has_balcony'] : 0
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function updateBeds(int $roomId, int $delta): bool {
        $stmt = $this->db->prepare("UPDATE rooms SET available_beds = MAX(0, available_beds + ?) WHERE id = ?");
        return $stmt->execute([$delta, $roomId]);
    }

    public function delete(int $id): bool {
        $stmt = $this->db->prepare("DELETE FROM rooms WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
