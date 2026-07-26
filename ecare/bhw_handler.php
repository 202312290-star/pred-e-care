<?php
// bhw_handler.php

// Allow cross-origin data transfer requests from your frontend port environment
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php'; 

function logActivity($pdo, $action, $detail) {
    $stmt = $pdo->prepare("INSERT INTO activities (action, detail) VALUES (?, ?)");
    $stmt->execute([$action, $detail]);
}

$request_method = $_SERVER["REQUEST_METHOD"];

if ($request_method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT id, name, zone, alerts, status, logged_at FROM bhw_assignments ORDER BY logged_at DESC");
        $assignments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            "status" => "success",
            "data" => $assignments
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Database read fail: " . $e->getMessage()]);
    }
} 
elseif ($request_method === 'POST') {
    $json_input = file_get_contents("php://input");
    $data = json_decode($json_input, true);

    if (!empty($data['name']) && !empty($data['zone']) && isset($data['alerts'])) {
        try {
            $status = intval($data['alerts']) >= 10 ? 'Overloaded' : 'Active';
            
            $sql = "INSERT INTO bhw_assignments (name, zone, alerts, status) VALUES (:name, :zone, :alerts, :status)";
            $stmt = $pdo->prepare($sql);
            
            $stmt->execute([
                ':name'   => $data['name'],
                ':zone'   => $data['zone'],
                ':alerts' => intval($data['alerts']),
                ':status' => $status
            ]);
            logActivity($pdo, 'BHW Assignment', "Assigned " . $data['name'] . " to " . $data['zone'] . " (Alerts: " . $data['alerts'] . ")");

            echo json_encode([
                "status" => "success",
                "message" => "BHW assignment logged successfully."
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Database write fail: " . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Incomplete request body parameters supplied."]);
    }
} 
else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "HTTP Request Method block activated."]);
}
?>