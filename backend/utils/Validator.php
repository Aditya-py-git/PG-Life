<?php
/**
 * Request Input Validator & Sanitizer
 */
class Validator {
    public static function getJsonInput(): array {
        $raw = file_get_contents('php://input');
        if (empty($raw)) {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    public static function validate(array $data, array $rules): array {
        $errors = [];
        foreach ($rules as $field => $fieldRules) {
            $value = $data[$field] ?? null;
            $ruleList = explode('|', $fieldRules);

            foreach ($ruleList as $rule) {
                if ($rule === 'required' && (empty($value) && $value !== '0' && $value !== 0)) {
                    $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
                    break;
                }
                if ($rule === 'email' && !empty($value) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                    $errors[$field] = 'Please provide a valid email address.';
                }
                if (str_starts_with($rule, 'min:') && !empty($value)) {
                    $min = (int) substr($rule, 4);
                    if (is_string($value) && mb_strlen($value) < $min) {
                        $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . " must be at least $min characters.";
                    }
                }
                if ($rule === 'numeric' && !empty($value) && !is_numeric($value)) {
                    $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' must be a valid number.';
                }
            }
        }
        return $errors;
    }

    public static function sanitizeString(?string $str): string {
        if ($str === null) return '';
        return htmlspecialchars(trim($str), ENT_QUOTES, 'UTF-8');
    }
}
