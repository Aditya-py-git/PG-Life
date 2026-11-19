<?php
require_once __DIR__ . '/../config/Database.php';

class Booking {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function create(int $userId, array $data): array {
        // Fetch room to confirm availability and rent
        $roomStmt = $this->db->prepare("SELECT * FROM rooms WHERE id = ? AND property_id = ? LIMIT 1");
        $roomStmt->execute([$data['room_id'], $data['property_id']]);
        $room = $roomStmt->fetch();

        if (!$room) {
            throw new Exception("Selected room was not found in this property.");
        }
        if ($room['available_beds'] <= 0) {
            throw new Exception("Sorry, no beds are currently available in this room category.");
        }

        $bookingCode = 'PGL-' . date('Y') . '-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 5));
        $monthlyRent = (float) $room['monthly_rent'];
        $securityDeposit = (float) $room['security_deposit'];
        $totalInitialAmount = $monthlyRent + $securityDeposit;
        $stayDuration = isset($data['stay_duration_months']) ? (int)$data['stay_duration_months'] : 6;
        $paymentMethod = $data['payment_method'] ?? 'UPI';
        $transactionId = 'TXN_' . strtoupper(substr(md5(uniqid('', true)), 0, 12));

        $sql = "INSERT INTO bookings (
                    booking_code, user_id, property_id, room_id, check_in_date,
                    stay_duration_months, monthly_rent, security_deposit, total_initial_amount,
                    booking_status, payment_status, payment_method, transaction_id, special_requests
                ) VALUES (
                    ?, ?, ?, ?, ?,
                    ?, ?, ?, ?,
                    'confirmed', 'paid', ?, ?, ?
                )";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $bookingCode,
            $userId,
            $data['property_id'],
            $data['room_id'],
            $data['check_in_date'],
            $stayDuration,
            $monthlyRent,
            $securityDeposit,
            $totalInitialAmount,
            $paymentMethod,
            $transactionId,
            $data['special_requests'] ?? null
        ]);

        $bookingId = (int) $this->db->lastInsertId();

        // Decrement available beds by 1
        $updRoom = $this->db->prepare("UPDATE rooms SET available_beds = MAX(0, available_beds - 1) WHERE id = ?");
        $updRoom->execute([$data['room_id']]);

        return $this->findById($bookingId);
    }

    public function findById(int $id): ?array {
        $sql = "SELECT b.*, 
                       p.title as property_title, p.address as property_address, p.locality, p.city, p.gender_type,
                       r.room_type, r.title as room_title,
                       u.name as student_name, u.email as student_email, u.phone as student_phone,
                       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_cover = 1 LIMIT 1) as cover_image
                FROM bookings b
                JOIN properties p ON b.property_id = p.id
                JOIN rooms r ON b.room_id = r.id
                JOIN users u ON b.user_id = u.id
                WHERE b.id = ? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $booking = $stmt->fetch();
        return $booking ?: null;
    }

    public function getByUser(int $userId): array {
        $sql = "SELECT b.*, 
                       p.title as property_title, p.address as property_address, p.locality, p.city, p.gate_closing_time,
                       r.room_type, r.title as room_title,
                       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_cover = 1 LIMIT 1) as cover_image,
                       o.name as owner_name, o.phone as owner_phone
                FROM bookings b
                JOIN properties p ON b.property_id = p.id
                JOIN rooms r ON b.room_id = r.id
                JOIN users o ON p.owner_id = o.id
                WHERE b.user_id = ?
                ORDER BY b.id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$userId]);
        return $stmt->fetchAll();
    }

    public function getByOwner(int $ownerId): array {
        $sql = "SELECT b.*, 
                       p.title as property_title, p.locality, p.city,
                       r.room_type, r.title as room_title,
                       u.name as student_name, u.email as student_email, u.phone as student_phone,
                       u.college_or_company as student_institution,
                       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_cover = 1 LIMIT 1) as cover_image
                FROM bookings b
                JOIN properties p ON b.property_id = p.id
                JOIN rooms r ON b.room_id = r.id
                JOIN users u ON b.user_id = u.id
                WHERE p.owner_id = ?
                ORDER BY b.id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$ownerId]);
        return $stmt->fetchAll();
    }

    public function updateStatus(int $bookingId, string $status, ?int $ownerId = null): bool {
        if ($ownerId !== null) {
            $checkStmt = $this->db->prepare("SELECT b.id, b.room_id, b.booking_status FROM bookings b JOIN properties p ON b.property_id = p.id WHERE b.id = ? AND p.owner_id = ?");
            $checkStmt->execute([$bookingId, $ownerId]);
            $b = $checkStmt->fetch();
            if (!$b) return false;
        } else {
            $checkStmt = $this->db->prepare("SELECT id, room_id, booking_status FROM bookings WHERE id = ?");
            $checkStmt->execute([$bookingId]);
            $b = $checkStmt->fetch();
        }

        if (!$b) return false;

        $stmt = $this->db->prepare("UPDATE bookings SET booking_status = ? WHERE id = ?");
        $res = $stmt->execute([$status, $bookingId]);

        // If cancelled, return bed to room inventory
        if ($status === 'cancelled' && $b['booking_status'] !== 'cancelled') {
            $updRoom = $this->db->prepare("UPDATE rooms SET available_beds = available_beds + 1 WHERE id = ?");
            $updRoom->execute([$b['room_id']]);
        }

        return $res;
    }
}
