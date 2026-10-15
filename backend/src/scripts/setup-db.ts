import { pool } from '../config/database';
import fs from 'fs';
import path from 'path';

async function setup() {
  try {
    const sql = fs.readFileSync(path.resolve(__dirname, 'init_db.sql'), 'utf8');
    await pool.query(sql);
    console.log('Database schema initialized successfully');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

setup();
