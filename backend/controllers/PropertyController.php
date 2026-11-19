<?php
require_once __DIR__ . '/../models/Property.php';
require_once __DIR__ . '/../models/Room.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../config/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class PropertyController {
    private Property $propModel;
    private Room $roomModel;

    public function __construct() {
        $this->propModel = new Property();
        $this->roomModel = new Room();
    }

    public function index(): void {
        $filters = [
            'city' => $_GET['city'] ?? null,
            'locality' => $_GET['locality'] ?? null,
            'gender' => $_GET['gender'] ?? null,
            'min_price' => $_GET['min_price'] ?? null,
            'max_price' => $_GET['max_price'] ?? null,
            'room_type' => $_GET['room_type'] ?? null,
            'amenities' => $_GET['amenities'] ?? null,
            'search' => $_GET['search'] ?? null,
            'sort' => $_GET['sort'] ?? 'featured'
        ];

        $properties = $this->propModel->getAll($filters);
        Response::success([
            'count' => count($properties),
            'properties' => $properties
        ]);
    }

    public function featured(): void {
        $properties = $this->propModel->getFeatured(6);
        Response::success(['properties' => $properties]);
    }

    public function cities(): void {
        $cities = $this->propModel->getCitiesWithCounts();
        Response::success(['cities' => $cities]);
    }

    public function show(int $id): void {
        $property = $this->propModel->findById($id);
        if (!$property) {
            Response::notFound('Property not found.');
        }
        Response::success(['property' => $property]);
    }

    public function store(): void {
        $auth = AuthMiddleware::requireRole('owner');
        $input = Validator::getJsonInput();

        $errors = Validator::validate($input, [
            'title' => 'required|min:5',
            'description' => 'required|min:10',
            'city' => 'required',
            'locality' => 'required',
            'address' => 'required',
            'starting_price' => 'required|numeric'
        ]);

        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $input['owner_id'] = (int) $auth['user_id'];
        $propId = $this->propModel->create($input);
        $newProp = $this->propModel->findById($propId);

        Response::success(['property' => $newProp], 'Property listed successfully!', 201);
    }

    public function update(int $id): void {
        $auth = AuthMiddleware::requireRole('owner');
        $input = Validator::getJsonInput();

        $updated = $this->propModel->update($id, (int)$auth['user_id'], $input);
        if (!$updated) {
            Response::error('Failed to update property or you do not have permission.');
        }

        $property = $this->propModel->findById($id);
        Response::success(['property' => $property], 'Property updated successfully.');
    }

    public function destroy(int $id): void {
        $auth = AuthMiddleware::requireRole('owner');
        $deleted = $this->propModel->delete($id, (int)$auth['user_id']);

        if (!$deleted) {
            Response::error('Failed to delete property or you do not have permission.');
        }

        Response::success(null, 'Property removed successfully.');
    }

    public function myProperties(): void {
        $auth = AuthMiddleware::requireRole('owner');
        $properties = $this->propModel->getByOwner((int)$auth['user_id']);
        Response::success(['properties' => $properties]);
    }

    public function addRoom(int $propertyId): void {
        $auth = AuthMiddleware::requireRole('owner');
        $input = Validator::getJsonInput();

        $property = $this->propModel->findById($propertyId);
        if (!$property || (int)$property['owner_id'] !== (int)$auth['user_id']) {
            Response::forbidden('You do not own this property.');
        }

        $errors = Validator::validate($input, [
            'room_type' => 'required',
            'title' => 'required',
            'monthly_rent' => 'required|numeric',
            'total_beds' => 'required|numeric'
        ]);

        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $roomId = $this->roomModel->create($propertyId, $input);
        $room = $this->roomModel->findById($roomId);

        Response::success(['room' => $room], 'Room added successfully!', 201);
    }
}
