<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../config/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class StatsController {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getConnection();
    }

    public function ownerDashboard(): void {
        $auth = AuthMiddleware::requireRole('owner');
        $ownerId = (int) $auth['user_id'];

        // 1. Total Properties
        $propStmt = $this->db->prepare("SELECT COUNT(*) FROM properties WHERE owner_id = ?");
        $propStmt->execute([$ownerId]);
        $totalProperties = (int) $propStmt->fetchColumn();

        // 2. Bed Inventory & Occupancy
        $bedStmt = $this->db->prepare("
            SELECT SUM(r.total_beds) as total_beds, SUM(r.available_beds) as available_beds
            FROM rooms r
            JOIN properties p ON r.property_id = p.id
            WHERE p.owner_id = ?
        ");
        $bedStmt->execute([$ownerId]);
        $bedStats = $bedStmt->fetch();

        $totalBeds = (int) ($bedStats['total_beds'] ?? 0);
        $availableBeds = (int) ($bedStats['available_beds'] ?? 0);
        $occupiedBeds = max(0, $totalBeds - $availableBeds);
        $occupancyRate = $totalBeds > 0 ? round(($occupiedBeds / $totalBeds) * 100, 1) : 0;

        // 3. Financials (Monthly Rent from Active & Confirmed Bookings)
        $revStmt = $this->db->prepare("
            SELECT SUM(b.monthly_rent) as monthly_revenue, COUNT(*) as active_tenants
            FROM bookings b
            JOIN properties p ON b.property_id = p.id
            WHERE p.owner_id = ? AND b.booking_status IN ('confirmed', 'active')
        ");
        $revStmt->execute([$ownerId]);
        $revStats = $revStmt->fetch();

        $monthlyRevenue = (float) ($revStats['monthly_revenue'] ?? 0);
        $activeTenants = (int) ($revStats['active_tenants'] ?? 0);

        // 4. Pending Visits
        $visStmt = $this->db->prepare("
            SELECT COUNT(*) FROM visits v
            JOIN properties p ON v.property_id = p.id
            WHERE p.owner_id = ? AND v.status = 'scheduled'
        ");
        $visStmt->execute([$ownerId]);
        $pendingVisits = (int) $visStmt->fetchColumn();

        // 5. Open Complaints
        $compStmt = $this->db->prepare("
            SELECT COUNT(*) FROM complaints c
            JOIN properties p ON c.property_id = p.id
            WHERE p.owner_id = ? AND c.status IN ('open', 'in_progress')
        ");
        $compStmt->execute([$ownerId]);
        $openComplaints = (int) $compStmt->fetchColumn();

        Response::success([
            'total_properties' => $totalProperties,
            'total_beds' => $totalBeds,
            'occupied_beds' => $occupiedBeds,
            'available_beds' => $availableBeds,
            'occupancy_rate' => $occupancyRate,
            'monthly_revenue' => $monthlyRevenue,
            'active_tenants' => $activeTenants,
            'pending_visits' => $pendingVisits,
            'open_complaints' => $openComplaints,
            'db_driver' => Database::getDriver()
        ]);
    }
}
