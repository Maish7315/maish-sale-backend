require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  UPLOAD_DIR: process.env.UPLOAD_DIR || 'uploads',
  PORT: process.env.PORT || 10000,
  DATABASE_URL: process.env.DATABASE_URL || 'sqlite:./database.db',
};