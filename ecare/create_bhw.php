<?php
require_once 'db.php';

$email = 'bhw@sta-rita.gov.ph';
$password = password_hash('password123', PASSWORD_BCRYPT);

// Check if exists
$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if (!$stmt->fetch()) {
    $stmt = $pdo->prepare("INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)");
    $stmt->execute(['Barangay Health Worker', $email, $password, 'BHW']);
    echo "BHW user created successfully.\n";
} else {
    echo "BHW user already exists.\n";
}
?>
