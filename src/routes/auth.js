import express from 'express';
import { User } from '../models/User.js';
import { LoginAttempt } from '../models/LoginAttempt.js';
import { generateToken } from '../auth.js';

const router = express.Router();

// POST /signup
router.post('/signup', async (req, res) => {
  try {
    const { username, full_name, password } = req.body;

    // Input validation
    if (!username || !full_name || !password) {
      return res.status(400).json({ error: 'Username, full name, and password are required' });
    }

    if (username.length < 3 || username.length > 50) {
      return res.status(400).json({ error: 'Username must be between 3 and 50 characters' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Create user
    const user = await User.create(username.trim(), full_name.trim(), password);
    const token = generateToken(user);

    console.log(`User registered successfully: ${username}`);
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';

    // Input validation
    if (!username || !password) {
      await LoginAttempt.log(username || '', false, ip);
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user
    const user = await User.findByUsername(username.trim());
    if (!user) {
      await LoginAttempt.log(username, false, ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const isValid = User.validatePassword(user, password);
    if (!isValid) {
      await LoginAttempt.log(username, false, ip);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Log successful login
    await LoginAttempt.log(username, true, ip);

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    console.log(`User logged in successfully: ${username}`);
    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;