# ISCO Job Board Frontend

A modern React.js frontend for the ISCO Job Board application, built with Redux Saga for state management.

## Features

- **Modern React Architecture**: Built with React 18, Redux Toolkit, and Redux Saga
- **Responsive Design**: Mobile-first approach with modern CSS
- **Authentication**: Complete login/register system with JWT tokens
- **Job Management**: Browse, search, and filter job listings
- **Application System**: Submit and track job applications
- **Admin Panel**: Admin-only features for job and application management
- **Real-time Updates**: Optimistic UI updates with proper error handling

## Tech Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **Redux Saga** - Side effects management
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Styled Components** - CSS-in-JS styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on port 3001

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Environment Variables

Create a `.env` file in the frontend directory:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

## Project Structure

```
src/
├── components/          # React components
│   ├── auth/           # Authentication components
│   ├── jobs/           # Job-related components
│   ├── applications/   # Application components
│   ├── layout/         # Layout components
│   ├── pages/          # Page components
│   └── common/         # Shared components
├── store/              # Redux store
│   ├── actions/        # Action creators
│   ├── reducers/       # Redux Toolkit slices
│   └── sagas/          # Redux Saga effects
├── services/           # API services
└── utils/              # Utility functions
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## API Integration

The frontend communicates with the backend API through the `services/api.js` file. All API calls are handled through Redux Saga for proper side effect management.

## State Management

The application uses Redux Toolkit for state management with the following slices:

- **auth**: User authentication and profile management
- **jobs**: Job listings, filtering, and management
- **applications**: Job applications and status tracking

## Routing

The application uses React Router with the following routes:

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/jobs` - Job listings
- `/jobs/:id` - Job details
- `/jobs/:id/apply` - Apply for a job
- `/applications` - User applications
- `/profile` - User profile
- `/admin/*` - Admin-only routes

## Contributing

1. Follow the existing code style and patterns
2. Use Redux Saga for all side effects
3. Implement proper error handling
4. Add responsive design for mobile devices
5. Write meaningful component and function names

## License

This project is part of the ISCO Job Board application. 