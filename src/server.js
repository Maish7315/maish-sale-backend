const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { PORT, FRONTEND_ORIGIN, UPLOAD_DIR } = require('./config');
const { initDb } = require('./db');
const authRoutes = require('./routes/auth');
const salesRoutes = require('./routes/sales');

const app = express();

// Middleware
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Ensure uploads directory exists
fs.mkdirSync(path.join(__dirname, UPLOAD_DIR), { recursive: true });

// Initialize DB and start server
initDb().then(() => {
  console.log('Database initialized successfully');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});