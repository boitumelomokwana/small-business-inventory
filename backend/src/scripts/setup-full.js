const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

async function setup() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('Error: DATABASE_URL not found in .env file');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString,
  });

  try {
    const sql = fs.readFileSync(path.resolve(__dirname, 'full_setup.sql'), 'utf8');
    await pool.query(sql);
    console.log('Database schema initialized successfully (Users, Customers, Settings)');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    await pool.end();
    process.exit(1);
  }
}

setup();
