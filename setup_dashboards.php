<?php
/**
 * Setup script for dashboard module tables.
 * Creates map_zones, predicted_illnesses, alert_funnel, bhw_assignments, inventory_forecast
 * and populates them with initial data.
 */

$pdo = new PDO('mysql:host=localhost;dbname=pred_e_care', 'root', '');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

echo "Starting dashboard tables setup...\n\n";

// 1. map_zones
$pdo->exec("CREATE TABLE IF NOT EXISTS map_zones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    risk VARCHAR(20) NOT NULL,
    cases INT NOT NULL DEFAULT 0,
    trend VARCHAR(20) NOT NULL DEFAULT '0%'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$pdo->exec("TRUNCATE TABLE map_zones");
$pdo->exec("INSERT INTO map_zones (name, risk, cases, trend) VALUES
    ('Purok 1', 'high', 24, '+12%'),
    ('Purok 2', 'medium', 15, '+5%'),
    ('Purok 3', 'low', 4, '-2%'),
    ('Purok 4', 'high', 31, '+18%'),
    ('Purok 5', 'low', 2, '0%'),
    ('Purok 6', 'medium', 12, '+8%')
");
echo "✓ map_zones table created and populated.\n";

// 2. predicted_illnesses
$pdo->exec("CREATE TABLE IF NOT EXISTS predicted_illnesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    disease VARCHAR(100) NOT NULL,
    prediction TEXT NOT NULL,
    severity VARCHAR(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$pdo->exec("TRUNCATE TABLE predicted_illnesses");
$pdo->exec("INSERT INTO predicted_illnesses (disease, prediction, severity) VALUES
    ('Dengue', '+45% spike in Zone 2 & 4 next month due to high rainfall', 'high'),
    ('Influenza', '+20% increase barangay-wide in 14 days', 'medium'),
    ('Typhoid', 'Isolated cases in Zone 1. Monitor water supply.', 'medium')
");
echo "✓ predicted_illnesses table created and populated.\n";

// 3. alert_funnel
$pdo->exec("CREATE TABLE IF NOT EXISTS alert_funnel (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    value INT NOT NULL DEFAULT 0,
    fill_color VARCHAR(20) NOT NULL DEFAULT '#8b5e3c'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$pdo->exec("TRUNCATE TABLE alert_funnel");
$pdo->exec("INSERT INTO alert_funnel (name, value, fill_color) VALUES
    ('Alerts Generated', 120, '#8b5e3c'),
    ('Dispatched', 95, '#c4a882'),
    ('Outreach Done', 68, '#3d7a45')
");
echo "✓ alert_funnel table created and populated.\n";

// 4. bhw_assignments
$pdo->exec("CREATE TABLE IF NOT EXISTS bhw_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    zone VARCHAR(100) NOT NULL,
    alerts INT NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$pdo->exec("TRUNCATE TABLE bhw_assignments");
$pdo->exec("INSERT INTO bhw_assignments (name, zone, alerts, status) VALUES
    ('Maria Santos', 'Purok 1 & 2', 8, 'Active'),
    ('Juan Dela Cruz', 'Purok 3', 2, 'Active'),
    ('Elena Ramos', 'Purok 4', 14, 'Overloaded'),
    ('Pedro Garcia', 'Purok 5 & 6', 5, 'Active')
");
echo "✓ bhw_assignments table created and populated.\n";

// 5. inventory_forecast
$pdo->exec("CREATE TABLE IF NOT EXISTS inventory_forecast (
    id INT AUTO_INCREMENT PRIMARY KEY,
    day_label VARCHAR(50) NOT NULL,
    supply INT NOT NULL DEFAULT 0,
    projected_demand INT NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");

$pdo->exec("TRUNCATE TABLE inventory_forecast");
$pdo->exec("INSERT INTO inventory_forecast (day_label, supply, projected_demand) VALUES
    ('Day 1', 500, 40),
    ('Day 5', 420, 80),
    ('Day 10', 320, 150),
    ('Day 15', 200, 210),
    ('Day 20', 80, 300),
    ('Day 25', 0, 380),
    ('Day 30', 0, 450)
");
echo "✓ inventory_forecast table created and populated.\n";

echo "\n✅ All dashboard tables setup complete!\n";
?>
