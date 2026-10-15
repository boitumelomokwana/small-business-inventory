const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function setup() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const sql = fs.readFileSync(path.resolve(__dirname, 'init_db.sql'), 'utf8');
    await pool.query(sql);
    console.log('Database schema initialized successfully');
    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    await pool.end();
    process.exit(1);
  }
}

setup();
