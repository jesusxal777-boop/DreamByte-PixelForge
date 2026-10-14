<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

function respond(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

$action = $_GET['action'] ?? 'health';

if ($action !== 'health') {
    respond(404, [
        'ok' => false,
        'error' => 'endpoint_not_implemented',
        'message' => 'This API route has not been implemented yet.',
    ]);
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    respond(503, [
        'ok' => false,
        'service' => 'DreamByte PixelForge API',
        'database' => 'not_configured',
        'message' => 'Copy config.example.php to config.php and configure the database on the hosting account.',
    ]);
}

$config = require $configPath;
$required = ['db_host', 'db_name', 'db_user', 'db_pass'];
foreach ($required as $key) {
    if (!isset($config[$key]) || $config[$key] === '' || str_starts_with((string) $config[$key], 'REPLACE_WITH_')) {
        respond(503, [
            'ok' => false,
            'service' => 'DreamByte PixelForge API',
            'database' => 'not_configured',
            'message' => 'Database settings are incomplete.',
        ]);
    }
}

try {
    $dsn = sprintf(
        'mysql:host=%s;dbname=%s;charset=utf8mb4',
        $config['db_host'],
        $config['db_name']
    );

    $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    $pdo->query('SELECT 1');
    respond(200, [
        'ok' => true,
        'service' => 'DreamByte PixelForge API',
        'database' => 'connected',
        'version' => '0.1.0',
    ]);
} catch (Throwable $error) {
    // Do not expose database hostnames, credentials, or raw server errors.
    error_log('PixelForge database health check failed.');
    respond(503, [
        'ok' => false,
        'service' => 'DreamByte PixelForge API',
        'database' => 'unavailable',
        'message' => 'The database connection failed. Check the hosting control panel settings.',
    ]);
}
