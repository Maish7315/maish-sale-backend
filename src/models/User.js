const { db, isSQLite } = require('../db');
const bcrypt = require('bcrypt');

class User {
  static async create(username, fullName, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    if (isSQLite) {
      return new Promise((resolve, reject) => {
        db.run(
          'INSERT INTO users (username, full_name, password_hash) VALUES (?, ?, ?)',
          [username, fullName, hashedPassword],
          function(err) {
            if (err) reject(err);
            else resolve({ id: this.lastID, username, role: 'employee' });
          }
        );
      });
    } else {
      const result = await db.query(
        'INSERT INTO users (username, full_name, password_hash) VALUES ($1, $2, $3) RETURNING id',
        [username, fullName, hashedPassword]
      );
      return { id: result.rows[0].id, username, role: 'employee' };
    }
  }

  static async findByUsername(username) {
    if (isSQLite) {
      return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    } else {
      const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
      return result.rows[0];
    }
  }

  static async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }
}

module.exports = User;