# Maish Sale Sync Backend

A Node.js backend for the Maish Sale Sync application, providing authentication, sales management, and file upload functionality.

## Features

- User authentication (signup/login)
- Sales submission with optional receipt uploads
- SQLite database for data persistence
- JWT-based authentication
- File upload handling for images
- CORS support for frontend integration

## Prerequisites

- Node.js (version 18.x or higher)
- npm

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
   - `FRONTEND_ORIGIN`: The origin of your frontend application (e.g., `http://localhost:3000`)
   - `UPLOAD_DIR`: Directory for uploaded files (default: `uploads`)
   - `PORT`: Port for the server (default: 10000)
   - `DATABASE_URL`: Database connection string (default: `sqlite:./database.db`)

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 10000).

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Sales
- `POST /api/sales/create` - Create a new sale (requires authentication)
- `GET /api/sales/me` - Get user's sales (requires authentication)

### Health Check
- `GET /api/health` - Health check endpoint

## Deployment on Render

1. Push your code to a GitHub repository.

2. Connect your GitHub repository to Render:
   - Go to [Render](https://render.com) and sign in.
   - Click "New" and select "Web Service".
   - Connect your GitHub repository.

3. Configure the service:
   - **Name**: Choose a name for your service.
   - **Environment**: Select "Node".
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Root Directory**: `backend` (if your backend is in a subdirectory)

4. Set environment variables in Render:
   - `JWT_SECRET`: Your JWT secret
   - `FRONTEND_ORIGIN`: Your frontend URL (e.g., `https://your-frontend.onrender.com`)
   - `UPLOAD_DIR`: `uploads`
   - `PORT`: `10000` (Render will override this, but it's good to set)
   - `DATABASE_URL`: `sqlite:./database.db`

5. Deploy the service.

Note: Since this uses SQLite, the database file will be created in the persistent disk provided by Render. Ensure your service has a persistent disk if needed, but for SQLite, it should work with the local file system.

## Project Structure

```
backend/
├── src/
│   ├── server.js          # Main server file
│   ├── config.js          # Configuration
│   ├── db.js              # Database initialization
│   ├── routes/
│   │   ├── auth.js        # Authentication routes
│   │   └── sales.js       # Sales routes
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   └── salesController.js   # Sales logic
│   ├── models/
│   │   ├── User.js        # User model
│   │   ├── Sale.js        # Sale model
│   │   └── LoginAttempt.js # Login attempt model
│   ├── middleware/
│   │   └── auth.js        # Authentication middleware
│   ├── services/
│   │   └── authService.js # Auth services
│   └── utils/             # Utility functions
├── uploads/               # Uploaded files
├── package.json
├── package-lock.json
├── .env.example
├── .gitignore
└── README.md
```

## License

MIT