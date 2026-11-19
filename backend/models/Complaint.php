<?php
require_once __DIR__ . '/../config/Database.php';

class Complaint {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(int $userId, array $data): int {
        $sql = "INSERT INTO complaints (user_id, property_id, category, title, description, status, priority)
                VALUES (?, ?, ?, ?, ?, 'open', ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $userId,
            $data['property_id'],
            $data['category'] ?? 'other',
            $data['title'],
            $data['description'],
            $data['priority'] ?? 'medium'
        ]);
        return (int) $this->db->lastInsertId();
    }

    public function getByUser(int $userId): array {
        $sql = "SELECT c.*, p.title as property_title, p.locality
                FROM complaints c
                JOIN properties p ON c.property_id = p.id
                WHERE c.user_id = ?
                ORDER BY c.id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public function getByOwner(int $ownerId): array {
        $sql = "SELECT c.*, p.title as property_title, p.locality,
                       u.name as student_name, u.phone as student_phone
                FROM complaints c
                JOIN properties p ON c.property_id = p.id
                JOIN users u ON c.user_id = u.id
                WHERE p.owner_id = ?
                ORDER BY c.id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$ownerId]);
        return $stmt->fetchAll();
    }

    public function updateStatus(int $complaintId, string $status, int $ownerId): bool {
        $checkStmt = $this->db->prepare("SELECT c.id FROM complaints c JOIN properties p ON c.property_id = p.id WHERE c.id = ? AND p.owner_id = ?");
        $checkStmt->execute([$complaintId, $ownerId]);
        if ($checkStmt->rowCount() === 0) return false;

        $stmt = $this->db->prepare("UPDATE complaints SET status = ? WHERE id = ?");
        return $stmt->execute([$status, $complaintId]);
    }
}
