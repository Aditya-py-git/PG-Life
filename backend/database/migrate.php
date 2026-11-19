<?php
/**
 * Migration & Seeding Runner
 */
require_once __DIR__ . '/../config/Config.php';
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/seed_helper.php';

try {
    $pdo = Database::getConnection();
    $driver = Database::getDriver();
    echo "Running migration for driver: $driver ...\n";

    if ($driver === 'mysql') {
        $schema = file_get_contents(__DIR__ . '/schema.sql');
        $pdo->exec($schema);
        echo "MySQL schema applied successfully.\n";
    }

    SeedHelper::runSeed($pdo);
    echo "Seed data inserted successfully!\n";
    echo "PG-Life database setup is 100% READY.\n";
} catch (Throwable $e) {
    echo "Error during migration: " . $e->getMessage() . "\n";
    exit(1);
}
