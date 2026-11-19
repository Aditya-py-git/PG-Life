<?php
require_once __DIR__ . '/../models/Wishlist.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../config/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class WishlistController {
    private Wishlist $wishlistModel;

    public function __construct() {
        $this->wishlistModel = new Wishlist();
    }

    public function index(): void {
        $auth = AuthMiddleware::requireAuth();
        $properties = $this->wishlistModel->getByUser((int)$auth['user_id']);
        $ids = $this->wishlistModel->getUserWishlistIds((int)$auth['user_id']);

        Response::success([
            'properties' => $properties,
            'wishlist_ids' => $ids
        ]);
    }

    public function toggle(): void {
        $auth = AuthMiddleware::requireAuth();
        $input = Validator::getJsonInput();

        if (empty($input['property_id'])) {
            Response::error('property_id is required.');
        }

        $propertyId = (int) $input['property_id'];
        $isAdded = $this->wishlistModel->toggle((int)$auth['user_id'], $propertyId);
        $ids = $this->wishlistModel->getUserWishlistIds((int)$auth['user_id']);

        Response::success([
            'is_in_wishlist' => $isAdded,
            'wishlist_ids' => $ids
        ], $isAdded ? 'Added to your favorites!' : 'Removed from favorites.');
    }
}
