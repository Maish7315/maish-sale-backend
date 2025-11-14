const { db } = require('../db');
const bcrypt = require('bcrypt');

class User {
  static async create(username, fullName, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.query(
      'INSERT INTO users (username, full_name, password_hash) VALUES ($1, $2, $3) RETURNING id',
      [username, fullName, hashedPassword]
    );
    return { id: result.rows[0].id, username, role: 'employee' };
  }

  static async findByUsername(username) {
    const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    return result.rows[0];
  }

  static async validatePassword(user, password) {
    return await bcrypt.compare(password, user.password_hash);
  }
}

module.exports = User;