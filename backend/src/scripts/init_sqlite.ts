// SQLite initialization script for small-business-inventory
// Run with: npm run init-db
import { getDb } from '../config/sqlite';

async function init() {
  const db = await getDb();
  // Create products table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price REAL NOT NULL,
      stock_quantity INTEGER NOT NULL,
      low_stock_threshold INTEGER,
      created_at DATETIME DEFAULT (datetime('now')),
      updated_at DATETIME DEFAULT (datetime('now'))
    );
  `);

  // Optionally seed some demo data
  const count = await db.get<{ cnt: number }>('SELECT COUNT(*) as cnt FROM products');
  if (count.cnt === 0) {
    await db.run(
      `INSERT INTO products (user_id, name, category, price, stock_quantity, low_stock_threshold)
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['demo-user', 'Sample Product', 'General', 9.99, 100, 10]
    );
  }
  console.log('SQLite database initialized');
  await db.close();
}

init().catch((err) => {
  console.error('Failed to init SQLite DB:', err);
  process.exit(1);
});
