<?php
require_once __DIR__ . '/../models/Visit.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../config/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class VisitController {
    private Visit $visitModel;

    public function __construct() {
        $this->visitModel = new Visit();
    }

    public function create(): void {
        $auth = AuthMiddleware::requireAuth();
        $input = Validator::getJsonInput();

        $errors = Validator::validate($input, [
            'property_id' => 'required|numeric',
            'visit_date' => 'required',
            'time_slot' => 'required'
        ]);

        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $visitId = $this->visitModel->create((int)$auth['user_id'], $input);
        Response::success(['visit_id' => $visitId], 'Property visit scheduled successfully! The owner will be notified.', 201);
    }

    public function myVisits(): void {
        $auth = AuthMiddleware::requireAuth();
        $visits = $this->visitModel->getByUser((int)$auth['user_id']);
        Response::success(['visits' => $visits]);
    }

    public function ownerVisits(): void {
        $auth = AuthMiddleware::requireRole('owner');
        $visits = $this->visitModel->getByOwner((int)$auth['user_id']);
        Response::success(['visits' => $visits]);
    }

    public function updateStatus(int $id): void {
        $auth = AuthMiddleware::requireAuth();
        $input = Validator::getJsonInput();

        $status = $input['status'] ?? null;
        if (!in_array($status, ['scheduled', 'completed', 'cancelled', 'rescheduled'])) {
            Response::error('Invalid visit status.');
        }

        $ownerId = ($auth['role'] === 'owner') ? (int)$auth['user_id'] : null;
        $success = $this->visitModel->updateStatus($id, $status, $ownerId);

        if ($success) {
            Response::success(null, 'Visit status updated to ' . $status);
        } else {
            Response::error('Failed to update visit status.');
        }
    }
}
