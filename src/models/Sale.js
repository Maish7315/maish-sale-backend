const { db, isSQLite } = require('../db');

class Sale {
  static async create(userId, itemDescription, amountCents, commissionCents, timestamp, photoPath) {
    if (isSQLite) {
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO sales (user_id, item_description, amount_cents, commission_cents, timestamp, photo_path) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, itemDescription, amountCents, commissionCents, timestamp, photoPath],
          function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID });
          }
        );
      });
    } else {
      const result = await db.query(
        'INSERT INTO sales (user_id, item_description, amount_cents, commission_cents, timestamp, photo_path) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [userId, itemDescription, amountCents, commissionCents, timestamp, photoPath]
      );
      return { id: result.rows[0].id };
    }
  }

  static async findByUserId(userId) {
    if (isSQLite) {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM sales WHERE user_id = ? ORDER BY created_at DESC', [userId], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    } else {
      const result = await db.query('SELECT * FROM sales WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
      return result.rows;
    }
  }
}

module.exports = Sale;