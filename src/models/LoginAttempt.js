const { db, isSQLite } = require('../db');

class LoginAttempt {
  static async log(username, success, ipAddress) {
    if (isSQLite) {
      db.run('INSERT INTO login_attempts (username, success, ip_address) VALUES (?, ?, ?)', [username, success, ipAddress]);
    } else {
      await db.query('INSERT INTO login_attempts (username, success, ip_address) VALUES ($1, $2, $3)', [username, success, ipAddress]);
    }
  }
}

module.exports = LoginAttempt;