import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pool } from '../config/database';

const migrations = [
  '001_create_users.sql',
  '002_create_products.sql',
  '003_create_sales.sql',
  '004_create_sale_items.sql',
  '005_create_inventory_adjustments.sql',
  '006_preserve_sale_items_when_products_are_deleted.sql',
  '007_create_customers_and_settings.sql',
];

async function migrate() {
  const client = await pool.connect();

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    for (const name of migrations) {
      const { rowCount } = await client.query(
        'SELECT name FROM schema_migrations WHERE name = $1',
        [name],
      );
      if (rowCount) continue;

      const sql = await readFile(
        path.resolve(__dirname, '../../database/migrations', name),
        'utf8',
      );

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [name]);
        await client.query('COMMIT');
        console.log(`Applied database migration ${name}`);
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    client.release();
  }
}

migrate()
  .then(() => pool.end())
  .catch(async (error: unknown) => {
    console.error('Database migration failed', error);
    try {
      await pool.end();
    } catch (poolError) {
      console.error('Database pool shutdown failed', poolError);
    }
    process.exitCode = 1;
  });
