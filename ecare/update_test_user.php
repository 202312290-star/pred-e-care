<?php
require_once 'db.php';
try {
    $stmt = $pdo->prepare("UPDATE users SET role = 'BHW' WHERE email = 'bhw@sta-rita.gov.ph'");
    $stmt->execute();
    echo "Successfully updated test user role to BHW.";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage();
}
?>
