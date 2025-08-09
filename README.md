# Job Board Platform

A full-stack job board application built with Node.js, Express, SQLite, and React.

## Backend Setup

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Initialize the database:
```bash
npm run migrate
```

3. Seed the database with sample data:
```bash
npm run seed
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3001`

### Test Credentials

**Admin User:**
- Email: `admin@jobboard.com`
- Password: `admin123`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update user profile (requires auth)

#### Jobs
- `GET /api/jobs` - Get all jobs (public)
- `GET /api/jobs/:id` - Get specific job (public)
- `POST /api/jobs` - Create new job (admin only)
- `PUT /api/jobs/:id` - Update job (admin only)
- `DELETE /api/jobs/:id` - Delete job (admin only)

#### Applications
- `GET /api/applications` - Get applications (user sees own, admin sees all)
- `GET /api/applications/:id` - Get specific application
- `POST /api/applications` - Submit application (authenticated users)
- `PATCH /api/applications/:id/status` - Update application status (admin only)
- `DELETE /api/applications/:id` - Delete application
- `GET /api/applications/job/:jobId` - Get applications for specific job (admin only)

### Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

### Database

The application uses SQLite with the following tables:
- `users` - User accounts and authentication
- `jobs` - Job listings
- `applications` - Job applications

### Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with express-validator
- Rate limiting
- CORS protection
- Helmet security headers

### Environment Variables

- `PORT` - Server port (default: 3001)
- `JWT_SECRET` - JWT secret key (default: 'your-secret-key-change-in-production')
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:3000)
- `NODE_ENV` - Environment (development/production/test) 