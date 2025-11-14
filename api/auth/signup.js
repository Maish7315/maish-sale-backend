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

    const { username, full_name, password } = req.body;

    if (!username || !full_name || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.create(username, full_name, password);
    const token = generateToken(user);
    console.log(`User registered: ${username}`);
    res.status(201).json({ token });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.code === '23505') { // PostgreSQL unique violation
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
}