const mysql = require('mysql2/promise');

async function fixDb() {
  const connection = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: ''
  });

  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS pred_e_care');
    console.log('Database pred_e_care created or exists.');
    
    await connection.query('USE pred_e_care');
    
    // patients
    await connection.query(`
      CREATE TABLE IF NOT EXISTS patients (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          age INT NOT NULL,
          zone VARCHAR(255) DEFAULT 'Purok 1',
          symptoms TEXT,
          risk ENUM('High', 'Medium', 'Low') DEFAULT 'Low',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table patients created.');
    
    // check if zone exists in patients
    const [cols] = await connection.query("SHOW COLUMNS FROM patients LIKE 'zone'");
    if (cols.length === 0) {
      await connection.query("ALTER TABLE patients ADD COLUMN zone VARCHAR(255) DEFAULT 'Purok 1'");
      console.log('Added zone column to patients table.');
    }

    // bhw_assignments
    await connection.query(`
      CREATE TABLE IF NOT EXISTS bhw_assignments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          zone VARCHAR(100) NOT NULL,
          alerts INT NOT NULL DEFAULT 0,
          status VARCHAR(50) NOT NULL DEFAULT 'Active',
          logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table bhw_assignments created.');

    // medicine_inventory
    await connection.query(`
      CREATE TABLE IF NOT EXISTS medicine_inventory (
          item_id INT AUTO_INCREMENT PRIMARY KEY,
          medicine_name VARCHAR(255) NOT NULL,
          quantity_added INT NOT NULL,
          date_received DATE NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Table medicine_inventory created.');

    // activities
    await connection.query(`
      CREATE TABLE IF NOT EXISTS activities (
          id INT AUTO_INCREMENT PRIMARY KEY,
          action VARCHAR(255) NOT NULL,
          detail TEXT NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('All missing tables and columns created successfully.');
  } catch (error) {
    console.error('Error fixing db:', error);
  } finally {
    await connection.end();
  }
}

fixDb();
