<?php
require_once __DIR__ . '/../models/Review.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../config/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class ReviewController {
    private Review $reviewModel;

    public function __construct() {
        $this->reviewModel = new Review();
    }

    public function getByProperty(int $propertyId): void {
        $reviews = $this->reviewModel->getByProperty($propertyId);
        Response::success(['reviews' => $reviews]);
    }

    public function store(): void {
        $auth = AuthMiddleware::requireAuth();
        $input = Validator::getJsonInput();

        $errors = Validator::validate($input, [
            'property_id' => 'required|numeric',
            'rating' => 'required|numeric',
            'comment' => 'required|min:5'
        ]);

        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $reviewId = $this->reviewModel->create((int)$auth['user_id'], $input);
        Response::success(['review_id' => $reviewId], 'Thank you! Your review has been published.', 201);
    }
}
