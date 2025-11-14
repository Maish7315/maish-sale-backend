require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  DATABASE_URL: process.env.DATABASE_URL,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN,
  PORT: process.env.PORT || 5000,
};