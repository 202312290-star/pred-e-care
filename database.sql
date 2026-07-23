CREATE DATABASE IF NOT EXISTS pred_e_care;
USE pred_e_care;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('health_worker', 'nurse', 'admin') NOT NULL DEFAULT 'health_worker',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert a default admin user (password is 'admin123' hashed with bcrypt)
-- You can generate new bcrypt hashes in PHP using password_hash('your_password', PASSWORD_BCRYPT)
INSERT INTO users (full_name, email, password, role) 
VALUES (
    'Admin User', 
    'admin@ecare.com', 
    '$2y$10$w81o91qI0fT7B8l03C/6Q.iZ6M8t8Fz6z8W5K3h2sL5.0d7x7t0S2', -- This is the bcrypt hash for 'admin123'
    'admin'
) ON DUPLICATE KEY UPDATE id=id;

CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    symptoms TEXT,
    risk ENUM('High', 'Medium', 'Low') DEFAULT 'Low',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    action VARCHAR(255) NOT NULL,
    detail TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
