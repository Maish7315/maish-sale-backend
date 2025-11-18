import { db } from '../db.js';
import { hashPassword, verifyPassword } from '../auth.js';

export class User {
  static async create(username, fullName, password) {
    const hashedPassword = await hashPassword(password);

    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (username, full_name, password_hash) VALUES (?, ?, ?)`,
        [username, fullName, hashedPassword],
        function(err) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, username, role: 'employee' });
          }
        }
      );
    });
  }

  static findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  static validatePassword(user, password) {
    return verifyPassword(user.password_hash, password);
  }
}