<?php
// inventory.php

// Allow requests from your React development server port
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Handle CORS browser preflight options gracefully
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include database instance variables
require_once 'db.php';

function logActivity($pdo, $action, $detail) {
    $stmt = $pdo->prepare("INSERT INTO activities (action, detail) VALUES (?, ?)");
    $stmt->execute([$action, $detail]);
}

$method = $_SERVER['REQUEST_METHOD'];

// --- GET METHOD LAYER ---
if ($method === 'GET') {
    try {
        $query = "SELECT item_id, medicine_name, quantity_added, date_received, logged_at 
                  FROM medicine_inventory 
                  ORDER BY logged_at DESC";
        
        $stmt = $pdo->query($query);
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode([
            "status" => "success",
            "data" => $results
        ]);
    } catch (PDOException $e) {
        http_response_code(500); // Fixed function call syntax here
        echo json_encode([
            "status" => "error", 
            "message" => "Database read exception: " . $e->getMessage()
        ]);
    }
}

// --- POST METHOD LAYER ---
if ($method === 'POST') {
    $json_input = file_get_contents("php://input");
    $data = json_decode($json_input, true);

    if (!empty($data['medicine_name']) && isset($data['quantity_added']) && !empty($data['date_received'])) {
        try {
            $sql = "INSERT INTO medicine_inventory (medicine_name, quantity_added, date_received) 
                    VALUES (:medicine_name, :quantity_added, :date_received)";
            
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                ':medicine_name'  => htmlspecialchars(strip_tags(trim($data['medicine_name']))),
                ':quantity_added' => intval($data['quantity_added']),
                ':date_received'  => $data['date_received']
            ]);

            logActivity($pdo, 'Supply Registry', "Added " . $data['medicine_name'] . " (Qty: " . $data['quantity_added'] . ")");

            echo json_encode([
                "status" => "success",
                "message" => "Stock entry saved into SQL successfully!"
            ]);
        } catch (PDOException $e) {
            http_response_code(500); // Fixed function call syntax here
            echo json_encode([
                "status" => "error", 
                "message" => "Database write exception: " . $e->getMessage()
            ]);
        }
    } else {
        http_response_code(400);
        echo json_encode([
            "status" => "error", 
            "message" => "Incomplete parameters. All fields are required."
        ]);
    }
}
?>