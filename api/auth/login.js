const User = require('../../src/models/User');
const LoginAttempt = require('../../src/models/LoginAttempt');
const { generateToken } = require('../../src/services/authService');
const { initDb } = require('../../src/db');

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize DB if needed
    await initDb();

    const { username, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    if (!username || !password) {
      await LoginAttempt.log(username || '', false, ip);
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = await User.findByUsername(username);
    if (!user) {
      await LoginAttempt.log(username, false, ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await User.validatePassword(user, password);
    if (!isValid) {
      await LoginAttempt.log(username, false, ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await LoginAttempt.log(username, true, ip);
    const token = generateToken({ id: user.id, username: user.username, role: user.role });
    console.log(`User logged in: ${username}`);
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}