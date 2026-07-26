<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, DELETE, PUT, OPTIONS");
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
    // Fetch all patients
    $stmt = $pdo->query("SELECT * FROM patients ORDER BY created_at DESC");
    $patients = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($patients);
} 
elseif ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Check if it's a clear all action
    if (isset($data['action']) && $data['action'] === 'clearAll') {
        $pdo->query("TRUNCATE TABLE patients");
        logActivity($pdo, 'System', 'Cleared all patient records');
        echo json_encode(["status" => "success", "message" => "All patients cleared."]);
        exit();
    }

    $name = $data['name'] ?? '';
    $age = $data['age'] ?? '';
    $zone = $data['zone'] ?? 'Purok 1'; // Default fallback
    $symptoms = $data['symptoms'] ?? '';

    if (empty($name) || empty($age)) {
        echo json_encode(["status" => "error", "message" => "Name and age are required."]);
        exit();
    }

    // Simple AI risk calculation (Mock logic)
    $symptomsLower = strtolower($symptoms);
    $risk = 'Low';
    if (strpos($symptomsLower, 'fever') !== false || strpos($symptomsLower, 'cough') !== false) {
        $risk = 'Medium';
    }
    if (strpos($symptomsLower, 'chest pain') !== false || strpos($symptomsLower, 'difficulty breathing') !== false) {
        $risk = 'High';
    }

    $stmt = $pdo->prepare("INSERT INTO patients (name, age, zone, symptoms, risk) VALUES (?, ?, ?, ?, ?)");
    try {
        $stmt->execute([$name, $age, $zone, $symptoms, $risk]);
        logActivity($pdo, 'Added Patient', "Added $name (Risk: $risk)");
        echo json_encode(["status" => "success", "message" => "Patient added successfully."]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Failed to add patient: " . $e->getMessage()]);
    }
} 
elseif ($method === 'PUT') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    $data = json_decode(file_get_contents("php://input"), true);
    
    $name = $data['name'] ?? '';
    $age = $data['age'] ?? '';
    $symptoms = $data['symptoms'] ?? '';
    
    if ($id > 0 && !empty($name) && !empty($age)) {
        // Simple AI risk calculation
        $symptomsLower = strtolower($symptoms);
        $risk = 'Low';
        if (strpos($symptomsLower, 'fever') !== false || strpos($symptomsLower, 'cough') !== false) {
            $risk = 'Medium';
        }
        if (strpos($symptomsLower, 'chest pain') !== false || strpos($symptomsLower, 'difficulty breathing') !== false) {
            $risk = 'High';
        }
        
        try {
            $stmt = $pdo->prepare("UPDATE patients SET name = ?, age = ?, symptoms = ?, risk = ? WHERE id = ?");
            $stmt->execute([$name, $age, $symptoms, $risk, $id]);
            logActivity($pdo, 'Updated Patient', "Updated details of $name");
            echo json_encode(["status" => "success", "message" => "Patient updated successfully."]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error", "message" => "Failed to update patient: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid parameters."]);
    }
}
elseif ($method === 'DELETE') {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
    if ($id > 0) {
        // Fetch name for logging before deleting
        $stmt = $pdo->prepare("SELECT name FROM patients WHERE id = ?");
        $stmt->execute([$id]);
        $patient = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($patient) {
            $stmt = $pdo->prepare("DELETE FROM patients WHERE id = ?");
            if ($stmt->execute([$id])) {
                logActivity($pdo, 'Deleted Patient', "Removed " . $patient['name']);
                echo json_encode(["status" => "success", "message" => "Patient deleted."]);
            } else {
                echo json_encode(["status" => "error", "message" => "Failed to delete patient."]);
            }
        } else {
            echo json_encode(["status" => "error", "message" => "Patient not found."]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Invalid patient ID."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
