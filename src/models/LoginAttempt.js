import { db } from '../db.js';

export class LoginAttempt {
  static log(username, success, ipAddress) {
    db.run(
      `INSERT INTO login_attempts (username, success, ip_address) VALUES (?, ?, ?)`,
      [username, success ? 1 : 0, ipAddress],
      (err) => {
        if (err) {
          console.error('Error logging login attempt:', err);
          // Don't throw - logging failure shouldn't break auth
        }
      }
    );
  }
}