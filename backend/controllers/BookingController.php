<?php
require_once __DIR__ . '/../models/Booking.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../config/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class BookingController {
    private Booking $bookingModel;

    public function __construct() {
        $this->bookingModel = new Booking();
    }

    public function create(): void {
        $auth = AuthMiddleware::requireAuth();
        $input = Validator::getJsonInput();

        $errors = Validator::validate($input, [
            'property_id' => 'required|numeric',
            'room_id' => 'required|numeric',
            'check_in_date' => 'required'
        ]);

        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        try {
            $booking = $this->bookingModel->create((int)$auth['user_id'], $input);
            Response::success(['booking' => $booking], 'Booking confirmed successfully! Your room is reserved.', 201);
        } catch (Exception $e) {
            Response::error($e->getMessage(), 400);
        }
    }

    public function myBookings(): void {
        $auth = AuthMiddleware::requireAuth();
        $bookings = $this->bookingModel->getByUser((int)$auth['user_id']);
        Response::success(['bookings' => $bookings]);
    }

    public function ownerBookings(): void {
        $auth = AuthMiddleware::requireRole('owner');
        $bookings = $this->bookingModel->getByOwner((int)$auth['user_id']);
        Response::success(['bookings' => $bookings]);
    }

    public function updateStatus(int $id): void {
        $auth = AuthMiddleware::requireAuth();
        $input = Validator::getJsonInput();

        $status = $input['status'] ?? null;
        if (!in_array($status, ['confirmed', 'active', 'completed', 'cancelled'])) {
            Response::error('Invalid booking status.');
        }

        $ownerId = ($auth['role'] === 'owner') ? (int)$auth['user_id'] : null;
        $success = $this->bookingModel->updateStatus($id, $status, $ownerId);

        if ($success) {
            $updated = $this->bookingModel->findById($id);
            Response::success(['booking' => $updated], 'Booking status updated to ' . $status);
        } else {
            Response::error('Failed to update booking status or permission denied.');
        }
    }
}
