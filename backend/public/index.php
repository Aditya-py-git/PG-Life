<?php
/**
 * PG-Life REST API Front Controller & Router
 */
require_once __DIR__ . '/../middleware/CorsMiddleware.php';
require_once __DIR__ . '/../config/Response.php';

// Apply CORS headers and handle preflight OPTIONS immediately
CorsMiddleware::handle();

// Register autoloader / controllers
require_once __DIR__ . '/../controllers/AuthController.php';
require_once __DIR__ . '/../controllers/PropertyController.php';
require_once __DIR__ . '/../controllers/BookingController.php';
require_once __DIR__ . '/../controllers/VisitController.php';
require_once __DIR__ . '/../controllers/ReviewController.php';
require_once __DIR__ . '/../controllers/WishlistController.php';
require_once __DIR__ . '/../controllers/ComplaintController.php';
require_once __DIR__ . '/../controllers/StatsController.php';

// Parse URI & Method
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Normalize path: strip script name or base directory prefix
$scriptName = dirname($_SERVER['SCRIPT_NAME']);
if ($scriptName !== '/' && str_starts_with($requestUri, $scriptName)) {
    $path = substr($requestUri, strlen($scriptName));
} else {
    $path = $requestUri;
}
$path = '/' . trim($path, '/');

// Router Dispatch
try {
    // Health Check
    if ($path === '/api/health' || $path === '/api' || $path === '/') {
        Response::success([
            'status' => 'operational',
            'version' => '1.0.0',
            'platform' => 'PG-Life REST API',
            'database' => Database::getDriver(),
            'server_time' => date('c')
        ], 'PG-Life API is up and running');
    }

    // Database Seed Trigger
    if ($path === '/api/setup/seed') {
        require_once __DIR__ . '/../database/seed_helper.php';
        SeedHelper::runSeed(Database::getConnection());
        Response::success(['driver' => Database::getDriver()], 'Database successfully refreshed and seeded!');
    }

    // Auth Routes
    $authCtrl = new AuthController();
    if ($path === '/api/auth/register' && $method === 'POST') {
        $authCtrl->register();
    }
    if ($path === '/api/auth/login' && $method === 'POST') {
        $authCtrl->login();
    }
    if ($path === '/api/auth/me' && $method === 'GET') {
        $authCtrl->me();
    }
    if ($path === '/api/auth/profile' && ($method === 'PUT' || $method === 'POST')) {
        $authCtrl->updateProfile();
    }

    // Property Routes
    $propCtrl = new PropertyController();
    if ($path === '/api/properties' && $method === 'GET') {
        $propCtrl->index();
    }
    if ($path === '/api/properties/featured' && $method === 'GET') {
        $propCtrl->featured();
    }
    if ($path === '/api/properties/cities' && $method === 'GET') {
        $propCtrl->cities();
    }
    if ($path === '/api/properties/my' && $method === 'GET') {
        $propCtrl->myProperties();
    }
    if ($path === '/api/properties' && $method === 'POST') {
        $propCtrl->store();
    }

    // Single Property & Nested Subroutes: /api/properties/{id} and /api/properties/{id}/rooms
    if (preg_match('#^/api/properties/(\d+)$#', $path, $matches)) {
        $id = (int) $matches[1];
        if ($method === 'GET') $propCtrl->show($id);
        if ($method === 'PUT' || $method === 'POST') $propCtrl->update($id);
        if ($method === 'DELETE') $propCtrl->destroy($id);
    }
    if (preg_match('#^/api/properties/(\d+)/rooms$#', $path, $matches) && $method === 'POST') {
        $propCtrl->addRoom((int) $matches[1]);
    }

    // Booking Routes
    $bookCtrl = new BookingController();
    if ($path === '/api/bookings' && $method === 'POST') {
        $bookCtrl->create();
    }
    if ($path === '/api/bookings/my' && $method === 'GET') {
        $bookCtrl->myBookings();
    }
    if ($path === '/api/bookings/owner' && $method === 'GET') {
        $bookCtrl->ownerBookings();
    }
    if (preg_match('#^/api/bookings/(\d+)/status$#', $path, $matches) && ($method === 'PUT' || $method === 'POST')) {
        $bookCtrl->updateStatus((int) $matches[1]);
    }

    // Visit Routes
    $visitCtrl = new VisitController();
    if ($path === '/api/visits' && $method === 'POST') {
        $visitCtrl->create();
    }
    if ($path === '/api/visits/my' && $method === 'GET') {
        $visitCtrl->myVisits();
    }
    if ($path === '/api/visits/owner' && $method === 'GET') {
        $visitCtrl->ownerVisits();
    }
    if (preg_match('#^/api/visits/(\d+)/status$#', $path, $matches) && ($method === 'PUT' || $method === 'POST')) {
        $visitCtrl->updateStatus((int) $matches[1]);
    }

    // Review Routes
    $revCtrl = new ReviewController();
    if (preg_match('#^/api/reviews/property/(\d+)$#', $path, $matches) && $method === 'GET') {
        $revCtrl->getByProperty((int) $matches[1]);
    }
    if ($path === '/api/reviews' && $method === 'POST') {
        $revCtrl->store();
    }

    // Wishlist Routes
    $wishCtrl = new WishlistController();
    if ($path === '/api/wishlist' && $method === 'GET') {
        $wishCtrl->index();
    }
    if ($path === '/api/wishlist/toggle' && $method === 'POST') {
        $wishCtrl->toggle();
    }

    // Complaint / Maintenance Ticket Routes
    $compCtrl = new ComplaintController();
    if ($path === '/api/complaints' && $method === 'POST') {
        $compCtrl->store();
    }
    if ($path === '/api/complaints/my' && $method === 'GET') {
        $compCtrl->myComplaints();
    }
    if ($path === '/api/complaints/owner' && $method === 'GET') {
        $compCtrl->ownerComplaints();
    }
    if (preg_match('#^/api/complaints/(\d+)/status$#', $path, $matches) && ($method === 'PUT' || $method === 'POST')) {
        $compCtrl->updateStatus((int) $matches[1]);
    }

    // Stats / Analytics Routes
    $statsCtrl = new StatsController();
    if ($path === '/api/stats/owner' && $method === 'GET') {
        $statsCtrl->ownerDashboard();
    }

    // Route not found
    Response::notFound("Endpoint {$method} {$path} does not exist.");

} catch (Throwable $e) {
    Response::error('Internal Server Error: ' . $e->getMessage(), 500);
}
