<?php
require_once __DIR__ . '/../models/Complaint.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../config/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class ComplaintController {
    private Complaint $complaintModel;

    public function __construct() {
        $this->complaintModel = new Complaint();
    }

    public function myComplaints(): void {
        $auth = AuthMiddleware::requireAuth();
        $complaints = $this->complaintModel->getByUser((int)$auth['user_id']);
        Response::success(['complaints' => $complaints]);
    }

    public function ownerComplaints(): void {
        $auth = AuthMiddleware::requireRole('owner');
        $complaints = $this->complaintModel->getByOwner((int)$auth['user_id']);
        Response::success(['complaints' => $complaints]);
    }

    public function store(): void {
        $auth = AuthMiddleware::requireAuth();
        $input = Validator::getJsonInput();

        $errors = Validator::validate($input, [
            'property_id' => 'required|numeric',
            'title' => 'required|min:4',
            'description' => 'required|min:10'
        ]);

        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $id = $this->complaintModel->create((int)$auth['user_id'], $input);
        Response::success(['complaint_id' => $id], 'Maintenance ticket raised. The PG manager will attend to it shortly.', 201);
    }

    public function updateStatus(int $id): void {
        $auth = AuthMiddleware::requireRole('owner');
        $input = Validator::getJsonInput();

        $status = $input['status'] ?? null;
        if (!in_array($status, ['open', 'in_progress', 'resolved', 'closed'])) {
            Response::error('Invalid complaint status.');
        }

        $success = $this->complaintModel->updateStatus($id, $status, (int)$auth['user_id']);
        if ($success) {
            Response::success(null, 'Ticket status updated to ' . $status);
        } else {
            Response::error('Failed to update ticket status or access denied.');
        }
    }
}
