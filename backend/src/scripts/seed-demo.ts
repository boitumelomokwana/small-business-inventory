import bcrypt from 'bcryptjs';
import { pool } from '../config/database';
import { migrate } from './migrate';

const demoEmail = (process.env.DEMO_EMAIL ?? 'demo@example.com').trim().toLowerCase();
const demoPassword = process.env.DEMO_PASSWORD;

async function seedDemo() {
  if (!demoPassword || demoPassword.length < 12) {
    throw new Error('Set DEMO_PASSWORD to a password with at least 12 characters.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(demoEmail)) {
    throw new Error('DEMO_EMAIL must be a valid email address.');
  }

  await migrate();
  const passwordHash = await bcrypt.hash(demoPassword, 10);
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const userResult = await client.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ('Demo User', $1, $2)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [demoEmail, passwordHash],
    );
    const userId = userResult.rows[0].id as string;

    await client.query(
      `INSERT INTO business_settings (user_id, business_name, currency, tax_rate, notification_email)
       VALUES ($1, 'Motswedi General Store', 'ZAR', 15.00, $2)
       ON CONFLICT (user_id) DO UPDATE SET business_name = EXCLUDED.business_name,
         currency = EXCLUDED.currency, tax_rate = EXCLUDED.tax_rate,
         notification_email = EXCLUDED.notification_email, updated_at = CURRENT_TIMESTAMP`,
      [userId, demoEmail],
    );

    const products = [
      ['Maize Meal 2.5kg', 'Groceries', 39.99, 42, 8],
      ['Sunflower Oil 2L', 'Groceries', 64.5, 18, 5],
      ['Long-life Milk 1L', 'Dairy', 18.99, 6, 10],
      ['Laundry Soap 500g', 'Household', 24.99, 27, 6],
      ['Instant Coffee 200g', 'Beverages', 79.9, 12, 4],
      ['Rice 5kg', 'Groceries', 89.99, 3, 5],
      ['LED Bulb 9W', 'Household', 32, 20, 5],
      ['Bottled Water 1.5L', 'Beverages', 14.5, 36, 12],
    ] as const;
    const productIds: string[] = [];
    for (const [name, category, price, stock, threshold] of products) {
      const result = await client.query(
        `INSERT INTO products (user_id, name, category, price, stock_quantity, low_stock_threshold)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [userId, name, category, price, stock, threshold],
      );
      productIds.push(result.rows[0].id as string);
    }

    const customers = [
      ['Lerato', 'Mokoena', 'lerato.mokoena@example.test', '+27 82 555 0101', 'Soweto, Johannesburg'],
      ['Thabo', 'Dlamini', 'thabo.dlamini@example.test', '+27 83 555 0102', 'Tembisa, Gauteng'],
      ['Naledi', 'Pillay', 'naledi.pillay@example.test', '+27 84 555 0103', 'Sandton, Johannesburg'],
      ['Kabelo', 'Maseko', 'kabelo.maseko@example.test', '+27 72 555 0104', 'Midrand, Gauteng'],
      ['Ayesha', 'Khan', 'ayesha.khan@example.test', '+27 73 555 0105', 'Rosebank, Johannesburg'],
    ] as const;
    for (const [firstName, lastName, email, phone, address] of customers) {
      await client.query(
        `INSERT INTO customers (user_id, first_name, last_name, email, phone, address)
         SELECT $1, $2, $3, $4, $5, $6
         WHERE NOT EXISTS (SELECT 1 FROM customers WHERE user_id = $1 AND email = $4)`,
        [userId, firstName, lastName, email, phone, address],
      );
    }

    const hasSales = await client.query('SELECT 1 FROM sales WHERE user_id = $1 LIMIT 1', [userId]);
    if (!hasSales.rowCount && productIds.length >= 5) {
      const saleLines = [
        [[0, 2], [7, 3]], [[1, 1], [2, 4]], [[3, 2], [4, 1]],
        [[5, 1], [0, 1]], [[6, 3], [7, 2]], [[2, 6], [3, 1]],
      ] as const;
      for (const [index, lines] of saleLines.entries()) {
        const saleDate = new Date();
        saleDate.setDate(saleDate.getDate() - (saleLines.length - index - 1));
        const selected = await client.query(
          'SELECT id, price FROM products WHERE id = ANY($1::uuid[]) ORDER BY array_position($1::uuid[], id)',
          [lines.map(([productIndex]) => productIds[productIndex])],
        );
        const total = selected.rows.reduce((sum: number, product: { price: string }, lineIndex: number) => {
          const line = lines[lineIndex];
          return sum + Number(product.price) * (line ? line[1] : 0);
        }, 0);
        const sale = await client.query(
          'INSERT INTO sales (user_id, total_amount, created_at) VALUES ($1, $2, $3) RETURNING id',
          [userId, total.toFixed(2), saleDate],
        );
        for (let lineIndex = 0; lineIndex < selected.rows.length; lineIndex++) {
          const product = selected.rows[lineIndex] as { id: string; price: string };
          const line = lines[lineIndex];
          if (!line) continue;
          const quantity = line[1];
          await client.query(
            `INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
             VALUES ($1, $2, $3, $4, $5)`,
            [sale.rows[0].id, product.id, quantity, product.price, (Number(product.price) * quantity).toFixed(2)],
          );
        }
      }
    }

    await client.query('COMMIT');
    console.log(`Demo data is ready for ${demoEmail}.`);
    console.log('Existing demo account password has been reset to DEMO_PASSWORD.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

seedDemo()
  .catch((error: unknown) => {
    console.error('Demo database seeding failed', error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
