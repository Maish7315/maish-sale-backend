import { db } from '../db.js';

export class Sale {
  static create(userId, itemDescription, amountCents, commissionCents, timestamp, photoPath) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO sales (user_id, item_description, amount_cents, commission_cents, timestamp, photo_path) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, itemDescription, amountCents, commissionCents, timestamp, photoPath],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID });
          }
        }
      );
    });
  }

  static findByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM sales WHERE user_id = ? ORDER BY created_at DESC`,
        [userId],
        (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        }
      );
    });
  }
}