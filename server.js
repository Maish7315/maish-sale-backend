const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDb } = require('./src/db');
const authRoutes = require('./src/routes/auth');
const salesRoutes = require('./src/routes/sales');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json());

// Serve static files from uploads
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/sales', salesRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Initialize DB and start server
initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
});