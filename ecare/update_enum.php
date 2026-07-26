<?php
require_once 'db.php';
try {
    $pdo->exec("ALTER TABLE users MODIFY COLUMN role ENUM('health_worker', 'nurse', 'admin', 'BHW') NOT NULL DEFAULT 'health_worker'");
    echo "Successfully updated users table ENUM for role.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
