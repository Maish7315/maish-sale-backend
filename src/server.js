import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { initDatabase } from './database/init.js';
import authRoutes from './routes/auth.js';
import salesRoutes from './routes/sales.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize database
await initDatabase();

// Middleware
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());

// Multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Routes
app.use('/api', authRoutes);
app.use('/api', salesRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: "OK" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});