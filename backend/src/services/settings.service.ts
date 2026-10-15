import { pool } from '../config/database';
import { BusinessSettings, UpdateSettingsDto } from '../types/settings';

export const settingsService = {
  async getSettings(userId: string): Promise<BusinessSettings | null> {
    const res = await pool.query(
      'SELECT * FROM business_settings WHERE user_id = $1',
      [userId]
    );
    return res.rows[0] || null;
  },

  async updateSettings(userId: string, data: UpdateSettingsDto): Promise<BusinessSettings> {
    const editableFields = ['business_name', 'currency', 'tax_rate', 'notification_email'] as const;
    const fields = editableFields.filter(key => data[key] !== undefined);

    if (fields.length === 0) {
      const current = await this.getSettings(userId);
      if (current) return current;
      throw new Error('No settings found to update');
    }

    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    const values = fields.map(field => data[field]);

    // Upsert logic: Insert if not exists, otherwise update
    const res = await pool.query(
      `INSERT INTO business_settings (user_id, ${fields.join(', ')})
       VALUES ($1, ${fields.map((_, i) => `$${i + 2}`).join(', ')})
       ON CONFLICT (user_id)
       DO UPDATE SET ${setClause}, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, ...values]
    );

    return res.rows[0];
  }
};
