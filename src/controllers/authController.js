const User = require('../models/User');
const LoginAttempt = require('../models/LoginAttempt');
const { generateToken } = require('../services/authService');

const signup = async (req, res) => {
  const { username, full_name, password } = req.body;

  if (!username || !full_name || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const user = await User.create(username, full_name, password);
    const token = generateToken(user);
    console.log(`User registered: ${username}`);
    res.status(201).json({ token });
  } catch (error) {
    if (error.code === 'SQLITE_CONSTRAINT' || error.code === '23505') {
      return res.status(400).json({ error: 'Username already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  if (!username || !password) {
    await LoginAttempt.log(username || '', false, ip);
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
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
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { signup, login };