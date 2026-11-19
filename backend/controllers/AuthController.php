<?php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../config/Response.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

class AuthController {
    private User $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function register(): void {
        $input = Validator::getJsonInput();
        $errors = Validator::validate($input, [
            'name' => 'required|min:2',
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        // Check duplicate email
        $existing = $this->userModel->findByEmail($input['email']);
        if ($existing) {
            Response::error('An account with this email address already exists.', 409);
        }

        $userId = $this->userModel->create($input);
        $user = $this->userModel->findById($userId);

        $token = JWT::encode([
            'user_id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'name' => $user['name']
        ]);

        Response::success([
            'user' => $user,
            'token' => $token
        ], 'Registration successful!', 201);
    }

    public function login(): void {
        $input = Validator::getJsonInput();
        $errors = Validator::validate($input, [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if (!empty($errors)) {
            Response::error('Validation failed', 422, $errors);
        }

        $user = $this->userModel->findByEmail($input['email']);
        if (!$user || !password_verify($input['password'], $user['password'])) {
            Response::error('Invalid email or password credentials.', 401);
        }

        // Strip password before returning
        unset($user['password']);

        $token = JWT::encode([
            'user_id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'name' => $user['name']
        ]);

        Response::success([
            'user' => $user,
            'token' => $token
        ], 'Welcome back, ' . $user['name'] . '!');
    }

    public function me(): void {
        $auth = AuthMiddleware::requireAuth();
        $user = $this->userModel->findById((int)$auth['user_id']);

        if (!$user) {
            Response::unauthorized('User not found.');
        }

        Response::success(['user' => $user]);
    }

    public function updateProfile(): void {
        $auth = AuthMiddleware::requireAuth();
        $input = Validator::getJsonInput();

        $updated = $this->userModel->updateProfile((int)$auth['user_id'], $input);
        if ($updated) {
            $user = $this->userModel->findById((int)$auth['user_id']);
            Response::success(['user' => $user], 'Profile updated successfully.');
        } else {
            Response::error('Failed to update profile.');
        }
    }
}
