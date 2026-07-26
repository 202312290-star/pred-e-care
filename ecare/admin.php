<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

function logActivity($pdo, $action, $detail) {
    $stmt = $pdo->prepare("INSERT INTO activities (action, detail) VALUES (?, ?)");
    $stmt->execute([$action, $detail]);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Fetch all users (excluding passwords)
    $stmt = $pdo->query("SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC");
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(["status" => "success", "users" => $users]);
} 
elseif ($method === 'POST') {
    // Update user role
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? '';
    $role = $data['role'] ?? '';

    if (empty($id) || empty($role)) {
        echo json_encode(["status" => "error", "message" => "User ID and Role are required."]);
        exit();
    }

    // Verify role is valid
    if (!in_array($role, ['health_worker', 'nurse', 'admin'])) {
        echo json_encode(["status" => "error", "message" => "Invalid role."]);
        exit();
    }

    // Get user details for logging
    $stmt = $pdo->prepare("SELECT full_name FROM users WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(["status" => "error", "message" => "User not found."]);
        exit();
    }

    $stmt = $pdo->prepare("UPDATE users SET role = ? WHERE id = ?");
    try {
        $stmt->execute([$role, $id]);
        logActivity($pdo, 'Updated User Role', "Changed role of {$user['full_name']} to $role");
        echo json_encode(["status" => "success", "message" => "User role updated successfully."]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to update role: " . $e->getMessage()]);
    }
} 
elseif ($method === 'DELETE') {
    // Delete user
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id > 0) {
        $stmt = $pdo->prepare("SELECT full_name FROM users WHERE id = ?");
        $stmt->execute([$id]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user) {
            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            if ($stmt->execute([$id])) {
                logActivity($pdo, 'Deleted User', "Removed user " . $user['full_name']);
                echo json_encode(["status" => "success", "message" => "User deleted successfully."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to delete user."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "User not found."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid user ID."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
