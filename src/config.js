require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
  CLOUDINARY_URL: process.env.CLOUDINARY_URL,
  DATABASE_URL: process.env.DATABASE_URL,
};