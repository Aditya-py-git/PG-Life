<?php
require_once __DIR__ . '/../config/Database.php';

class Property {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function getAll(array $filters = []): array {
        $sql = "SELECT p.*, 
                       u.name as owner_name, u.phone as owner_phone,
                       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_cover = 1 LIMIT 1) as cover_image
                FROM properties p
                JOIN users u ON p.owner_id = u.id
                WHERE 1=1";
        $params = [];

        // Filter by City
        if (!empty($filters['city'])) {
            $sql .= " AND LOWER(p.city) = LOWER(?)";
            $params[] = $filters['city'];
        }

        // Filter by Locality
        if (!empty($filters['locality'])) {
            $sql .= " AND LOWER(p.locality) LIKE LOWER(?)";
            $params[] = '%' . $filters['locality'] . '%';
        }

        // Filter by Gender
        if (!empty($filters['gender']) && $filters['gender'] !== 'all') {
            $sql .= " AND (p.gender_type = ? OR p.gender_type = 'unisex')";
            $params[] = $filters['gender'];
        }

        // Filter by Price range
        if (!empty($filters['min_price'])) {
            $sql .= " AND p.starting_price >= ?";
            $params[] = (float) $filters['min_price'];
        }
        if (!empty($filters['max_price'])) {
            $sql .= " AND p.starting_price <= ?";
            $params[] = (float) $filters['max_price'];
        }

        // Keyword Search (title, locality, address, description)
        if (!empty($filters['search'])) {
            $searchTerm = '%' . $filters['search'] . '%';
            $sql .= " AND (p.title LIKE ? OR p.locality LIKE ? OR p.address LIKE ? OR p.city LIKE ?)";
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
            $params[] = $searchTerm;
        }

        // Filter by Room Type
        if (!empty($filters['room_type']) && $filters['room_type'] !== 'all') {
            $sql .= " AND EXISTS (SELECT 1 FROM rooms r WHERE r.property_id = p.id AND r.room_type = ?)";
            $params[] = $filters['room_type'];
        }

        // Filter by Amenities (comma-separated or array)
        if (!empty($filters['amenities'])) {
            $amenitiesList = is_array($filters['amenities']) ? $filters['amenities'] : explode(',', $filters['amenities']);
            foreach ($amenitiesList as $amenity) {
                $trimmed = trim($amenity);
                if (!empty($trimmed)) {
                    $sql .= " AND EXISTS (SELECT 1 FROM property_amenities pa WHERE pa.property_id = p.id AND pa.amenity_key = ?)";
                    $params[] = $trimmed;
                }
            }
        }

        // Sorting
        $sort = $filters['sort'] ?? 'featured';
        switch ($sort) {
            case 'price_low':
                $sql .= " ORDER BY p.starting_price ASC";
                break;
            case 'price_high':
                $sql .= " ORDER BY p.starting_price DESC";
                break;
            case 'rating':
                $sql .= " ORDER BY p.rating DESC, p.total_reviews DESC";
                break;
            case 'newest':
                $sql .= " ORDER BY p.created_at DESC";
                break;
            case 'featured':
            default:
                $sql .= " ORDER BY p.is_featured DESC, p.rating DESC, p.id DESC";
                break;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $properties = $stmt->fetchAll();

        // Attach amenities & fallback cover for each
        foreach ($properties as &$prop) {
            $prop['amenities'] = $this->getPropertyAmenities((int)$prop['id']);
            if (empty($prop['cover_image'])) {
                $prop['cover_image'] = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
            }
            if (is_string($prop['rules'])) {
                $prop['rules'] = json_decode($prop['rules'], true) ?: [];
            }
        }

        return $properties;
    }

    public function getFeatured(int $limit = 6): array {
        return $this->getAll(['sort' => 'featured']);
    }

    public function findById(int $id): ?array {
        $sql = "SELECT p.*, 
                       u.name as owner_name, u.email as owner_email, u.phone as owner_phone, u.avatar as owner_avatar,
                       u.college_or_company as owner_company
                FROM properties p
                JOIN users u ON p.owner_id = u.id
                WHERE p.id = ? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $prop = $stmt->fetch();

        if (!$prop) {
            return null;
        }

        // Attach Related Entities
        $prop['images'] = $this->getPropertyImages($id);
        $prop['amenities'] = $this->getPropertyAmenities($id);
        $prop['rooms'] = $this->getPropertyRooms($id);
        $prop['rules'] = is_string($prop['rules']) ? (json_decode($prop['rules'], true) ?: []) : ($prop['rules'] ?: []);

        return $prop;
    }

    public function getByOwner(int $ownerId): array {
        $sql = "SELECT p.*, 
                       (SELECT image_url FROM property_images WHERE property_id = p.id AND is_cover = 1 LIMIT 1) as cover_image,
                       (SELECT COUNT(*) FROM bookings WHERE property_id = p.id) as total_bookings,
                       (SELECT COUNT(*) FROM visits WHERE property_id = p.id AND status = 'scheduled') as pending_visits,
                       (SELECT SUM(total_beds) FROM rooms WHERE property_id = p.id) as total_beds_count,
                       (SELECT SUM(available_beds) FROM rooms WHERE property_id = p.id) as available_beds_count
                FROM properties p
                WHERE p.owner_id = ?
                ORDER BY p.id DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$ownerId]);
        $properties = $stmt->fetchAll();

        foreach ($properties as &$prop) {
            $prop['rooms'] = $this->getPropertyRooms((int)$prop['id']);
            $prop['amenities'] = $this->getPropertyAmenities((int)$prop['id']);
            if (is_string($prop['rules'])) {
                $prop['rules'] = json_decode($prop['rules'], true) ?: [];
            }
        }
        return $properties;
    }

    public function create(array $data): int {
        $slug = $this->generateUniqueSlug($data['title'], $data['locality']);
        $rulesJson = isset($data['rules']) ? (is_array($data['rules']) ? json_encode($data['rules']) : $data['rules']) : json_encode([]);

        $sql = "INSERT INTO properties (
                    owner_id, title, slug, description, gender_type, 
                    address, locality, city, state, pincode, 
                    latitude, longitude, starting_price, security_deposit, 
                    notice_period_days, gate_closing_time, food_available, 
                    food_type, is_verified, is_featured, rules
                ) VALUES (
                    ?, ?, ?, ?, ?, 
                    ?, ?, ?, ?, ?, 
                    ?, ?, ?, ?, 
                    ?, ?, ?, 
                    ?, ?, ?, ?
                )";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $data['owner_id'],
            $data['title'],
            $slug,
            $data['description'],
            $data['gender_type'] ?? 'unisex',
            $data['address'],
            $data['locality'],
            $data['city'],
            $data['state'] ?? 'Karnataka',
            $data['pincode'],
            $data['latitude'] ?? 12.9716,
            $data['longitude'] ?? 77.5946,
            $data['starting_price'],
            $data['security_deposit'] ?? ($data['starting_price'] * 1.5),
            $data['notice_period_days'] ?? 30,
            $data['gate_closing_time'] ?? '10:30 PM',
            isset($data['food_available']) ? (int)$data['food_available'] : 1,
            $data['food_type'] ?? 'both',
            1, // auto-verified in demo
            isset($data['is_featured']) ? (int)$data['is_featured'] : 0,
            $rulesJson
        ]);

        $propertyId = (int) $this->db->lastInsertId();

        // Insert Amenities
        if (!empty($data['amenities']) && is_array($data['amenities'])) {
            $this->syncAmenities($propertyId, $data['amenities']);
        }

        // Insert Images
        if (!empty($data['images']) && is_array($data['images'])) {
            $isCover = 1;
            foreach ($data['images'] as $imgUrl) {
                if (!empty($imgUrl)) {
                    $this->addImage($propertyId, $imgUrl, $isCover);
                    $isCover = 0;
                }
            }
        } else {
            // Default cover image
            $this->addImage($propertyId, 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80', 1, 'Main View');
        }

        // Insert Default Rooms if provided
        if (!empty($data['rooms']) && is_array($data['rooms'])) {
            foreach ($data['rooms'] as $room) {
                $this->addRoom($propertyId, $room);
            }
        }

        return $propertyId;
    }

    public function update(int $id, int $ownerId, array $data): bool {
        $fields = [
            'title = ?', 'description = ?', 'gender_type = ?', 'address = ?',
            'locality = ?', 'city = ?', 'pincode = ?', 'starting_price = ?',
            'security_deposit = ?', 'gate_closing_time = ?', 'food_available = ?', 'food_type = ?'
        ];
        $params = [
            $data['title'],
            $data['description'],
            $data['gender_type'],
            $data['address'],
            $data['locality'],
            $data['city'],
            $data['pincode'],
            $data['starting_price'],
            $data['security_deposit'],
            $data['gate_closing_time'] ?? '10:30 PM',
            isset($data['food_available']) ? (int)$data['food_available'] : 1,
            $data['food_type'] ?? 'both'
        ];

        if (isset($data['rules'])) {
            $fields[] = 'rules = ?';
            $params[] = is_array($data['rules']) ? json_encode($data['rules']) : $data['rules'];
        }

        $params[] = $id;
        $params[] = $ownerId;

        $sql = "UPDATE properties SET " . implode(', ', $fields) . " WHERE id = ? AND owner_id = ?";
        $stmt = $this->db->prepare($sql);
        $updated = $stmt->execute($params);

        if ($updated && isset($data['amenities']) && is_array($data['amenities'])) {
            $this->syncAmenities($id, $data['amenities']);
        }

        return $updated;
    }

    public function delete(int $id, int $ownerId): bool {
        $stmt = $this->db->prepare("DELETE FROM properties WHERE id = ? AND owner_id = ?");
        return $stmt->execute([$id, $ownerId]);
    }

    public function getCitiesWithCounts(): array {
        $sql = "SELECT city, COUNT(*) as count, MIN(starting_price) as min_price 
                FROM properties 
                GROUP BY city 
                ORDER BY count DESC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll();
    }

    public function getPropertyImages(int $propertyId): array {
        $stmt = $this->db->prepare("SELECT id, image_url, is_cover, caption FROM property_images WHERE property_id = ? ORDER BY is_cover DESC, id ASC");
        $stmt->execute([$propertyId]);
        return $stmt->fetchAll();
    }

    public function getPropertyAmenities(int $propertyId): array {
        $stmt = $this->db->prepare("SELECT amenity_key FROM property_amenities WHERE property_id = ?");
        $stmt->execute([$propertyId]);
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getPropertyRooms(int $propertyId): array {
        $stmt = $this->db->prepare("SELECT * FROM rooms WHERE property_id = ? ORDER BY monthly_rent ASC");
        $stmt->execute([$propertyId]);
        return $stmt->fetchAll();
    }

    public function syncAmenities(int $propertyId, array $amenities): void {
        $delStmt = $this->db->prepare("DELETE FROM property_amenities WHERE property_id = ?");
        $delStmt->execute([$propertyId]);

        $insSql = ($this->db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql')
            ? "INSERT IGNORE INTO property_amenities (property_id, amenity_key) VALUES (?, ?)"
            : "INSERT OR IGNORE INTO property_amenities (property_id, amenity_key) VALUES (?, ?)";
        $insStmt = $this->db->prepare($insSql);

        foreach ($amenities as $key) {
            $trimmed = trim($key);
            if (!empty($trimmed)) {
                $insStmt->execute([$propertyId, $trimmed]);
            }
        }
    }

    public function addImage(int $propertyId, string $url, int $isCover = 0, string $caption = ''): void {
        $stmt = $this->db->prepare("INSERT INTO property_images (property_id, image_url, is_cover, caption) VALUES (?, ?, ?, ?)");
        $stmt->execute([$propertyId, $url, $isCover, $caption]);
    }

    public function addRoom(int $propertyId, array $room): int {
        $sql = "INSERT INTO rooms (property_id, room_type, title, monthly_rent, security_deposit, total_beds, available_beds, has_ac, has_attached_bathroom, has_balcony) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            $propertyId,
            $room['room_type'] ?? 'double',
            $room['title'] ?? 'Standard Room',
            $room['monthly_rent'],
            $room['security_deposit'] ?? ($room['monthly_rent'] * 1.5),
            $room['total_beds'] ?? 2,
            $room['available_beds'] ?? 2,
            $room['has_ac'] ?? 1,
            $room['has_attached_bathroom'] ?? 1,
            $room['has_balcony'] ?? 0
        ]);
        return (int) $this->db->lastInsertId();
    }

    private function generateUniqueSlug(string $title, string $locality): string {
        $base = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', "$title $locality")));
        $slug = $base;
        $counter = 1;

        $checkStmt = $this->db->prepare("SELECT id FROM properties WHERE slug = ? LIMIT 1");
        while (true) {
            $checkStmt->execute([$slug]);
            if ($checkStmt->rowCount() === 0) {
                break;
            }
            $slug = $base . '-' . $counter;
            $counter++;
        }
        return $slug;
    }
}
