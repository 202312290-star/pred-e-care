<?php

if ($method !== 'GET') {
    errorResponse('Method not allowed. Use GET.', 405);
}

$pdo = getDBConnection();

try {
    $stmt = $pdo->query("SELECT * FROM activity_log ORDER BY log_id DESC LIMIT 20");
    $activities = $stmt->fetchAll();

    // Map to frontend-compatible format
    $result = array_map(function ($a) {
        return [
            'id'        => (int) $a['log_id'],
            'action'    => $a['action'],
            'detail'    => $a['detail'],
            'timestamp' => $a['timestamp'],
        ];
    }, $activities);

    jsonResponse($result);
} catch (PDOException $e) {
    // If activity_log table doesn't exist, return empty
    jsonResponse([]);
}
