<?php
require_once __DIR__ . '/../config/Database.php';

class Visit {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(int $userId, array $data): int {
        $sql = "INSERT INTO visits (user_id, property_id, visit_date, time_slot, visit_type, status, notes)
                VALUES (?, ?, ?, ?, ?, 'scheduled', ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $userId,
            $data['property_id'],
            $data['visit_date'],
            $data['time_slot'],
            $data['visit_type'] ?? 'in_person',
            $data['notes'] ?? null
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function getByUser(int $userId): array {
        $sql = "SELECT v.*, 
                       p.title as property_title, p.address as property_address, p.locality, p.city,
                       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_cover = 1 LIMIT 1) as cover_image,
                       o.name as owner_name, o.phone as owner_phone
                FROM visits v
                JOIN properties p ON v.property_id = p.id
                JOIN users o ON p.owner_id = o.id
                WHERE v.user_id = ?
                ORDER BY v.visit_date ASC, v.id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public function getByOwner(int $ownerId): array {
        $sql = "SELECT v.*, 
                       p.title as property_title, p.locality, p.city,
                       u.name as student_name, u.email as student_email, u.phone as student_phone,
                       u.college_or_company as student_institution,
                       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_cover = 1 LIMIT 1) as cover_image
                FROM visits v
                JOIN properties p ON v.property_id = p.id
                JOIN users u ON v.user_id = u.id
                WHERE p.owner_id = ?
                ORDER BY v.visit_date ASC, v.id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$ownerId]);
        return $stmt->fetchAll();
    }

    public function updateStatus(int $visitId, string $status, ?int $ownerId = null): bool {
        if ($ownerId !== null) {
            $checkStmt = $this->db->prepare("SELECT v.id FROM visits v JOIN properties p ON v.property_id = p.id WHERE v.id = ? AND p.owner_id = ?");
            $checkStmt->execute([$visitId, $ownerId]);
            if ($checkStmt->rowCount() === 0) return false;
        }

        $stmt = $this->db->prepare("UPDATE visits SET status = ? WHERE id = ?");
        return $stmt->execute([$status, $visitId]);
    }
}
