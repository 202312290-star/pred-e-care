<?php
$data = [
    'fullName' => 'Test BHW Insert',
    'email' => 'testbhw@sta-rita.gov.ph',
    'password' => 'password123',
    'role' => 'BHW'
];

$ch = curl_init('http://localhost/ecare/register.php');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
$response = curl_exec($ch);
curl_close($ch);
echo "Register Response: " . $response;
?>
