# Maish Sale Sync Backend

A serverless Node.js backend for the Maish Sale Sync application, deployed on Vercel. Provides authentication, sales management, and cloud file upload functionality.

## Features

- User authentication (signup/login)
- Sales submission with optional receipt uploads to Cloudinary
- PostgreSQL database (Supabase/PlanetScale recommended)
- JWT-based authentication
- Serverless functions compatible with Vercel
- Cloud storage for images (Cloudinary)
- CORS support for frontend integration

## Prerequisites

- Node.js (version 18.x or higher)
- npm
- Vercel CLI (for local development)
- Cloudinary account (for image storage)
- PostgreSQL database (Supabase recommended)

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables file:
   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your configuration:
   - `JWT_SECRET`: A secure secret key for JWT tokens
   - `FRONTEND_URL`: The URL of your frontend application (e.g., `https://your-frontend.vercel.app`)
   - `CLOUDINARY_URL`: Your Cloudinary URL (e.g., `cloudinary://api_key:api_secret@cloud_name`)
   - `DATABASE_URL`: PostgreSQL connection string (e.g., from Supabase)

## Running the Application

### Local Development with Vercel
```bash
npm run dev
```

This uses `vercel dev` to run the serverless functions locally.

### Production
The backend is automatically deployed to Vercel when pushed to the main branch.

## API Endpoints

All endpoints are serverless functions deployed on Vercel.

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Sales
- `POST /api/sales/createSale` - Create a new sale with optional receipt upload (requires authentication)
- `GET /api/sales/getSales` - Get user's sales (requires authentication)

### Health Check
- `GET /api/health` - Health check endpoint

## Deployment on Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy the backend**:
   ```bash
   cd backend
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel dashboard or via CLI:
   - `JWT_SECRET`: Your JWT secret key
   - `FRONTEND_URL`: Your frontend URL (e.g., `https://your-frontend.vercel.app`)
   - `CLOUDINARY_URL`: Your Cloudinary URL
   - `DATABASE_URL`: Your PostgreSQL connection string

5. **Database Setup**:
   - Use Supabase for PostgreSQL database
   - The tables will be created automatically on first run
   - Ensure your database allows connections from Vercel's IP ranges

6. **Cloudinary Setup**:
   - Create a Cloudinary account
   - Get your Cloudinary URL from the dashboard
   - Set up a folder for receipt uploads

## Connecting Frontend

Update your frontend's API base URL to point to the deployed Vercel backend:

```javascript
const API_BASE_URL = 'https://your-backend.vercel.app';
```

## Database Schema

The application automatically creates the following tables:

- `users`: User accounts
- `sales`: Sales records with receipt URLs
- `login_attempts`: Security logging

## Project Structure

```
backend/
├── api/                   # Serverless functions
│   ├── auth/
│   │   ├── signup.js      # User registration
│   │   └── login.js       # User login
│   ├── sales/
│   │   ├── createSale.js  # Create sale with upload
│   │   └── getSales.js    # Get user sales
│   └── health.js          # Health check
├── src/
│   ├── config.js          # Configuration
│   ├── db.js              # Database connection
│   ├── models/
│   │   ├── User.js        # User model
│   │   ├── Sale.js        # Sale model
│   │   └── LoginAttempt.js # Login attempt model
│   ├── services/
│   │   └── authService.js # Auth services
│   └── utils/
│       ├── auth.js        # Auth utilities
│       ├── cloudinary.js  # Cloudinary upload
│       └── multipart.js   # Multipart parsing
├── package.json
├── package-lock.json
├── vercel.json            # Vercel configuration
├── .env.example
├── .gitignore
└── README.md
```

## License

MIT