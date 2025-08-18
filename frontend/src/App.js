import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfileRequest } from './store/actions';
import { NotificationProvider } from './contexts/NotificationContext';
import { ApplicationProvider } from './contexts/ApplicationContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';

// Pages
import LandingPage from './components/pages/LandingPage';
import UserDashboard from './components/dashboard/UserDashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';
import Jobs from './components/jobs/JobList';
import JobDetail from './components/jobs/JobDetail';
import Applications from './components/applications/ApplicationList';
import ApplicationForm from './components/applications/ApplicationForm';
import ApplicationDetail from './components/applications/ApplicationDetail';
import Profile from './components/auth/Profile';

function App() {
  const dispatch = useDispatch();
  const { token, loading, isAuthenticated } = useSelector((state) => state.auth);

  console.log('App component rendered', { token, loading, isAuthenticated });

  useEffect(() => {
    console.log('App useEffect triggered', { token });
    if (token && !isAuthenticated) {
      console.log('Dispatching getProfileRequest');
      dispatch(getProfileRequest());
    }
  }, [dispatch, token, isAuthenticated]);

  console.log('App render state:', { loading });

  if (loading) {
    console.log('Showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('Rendering main app content');
  return (
    <NotificationProvider>
      <ApplicationProvider>
        <Router>
        <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            
            {/* Protected Routes - User Only */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications" 
              element={
                <ProtectedRoute>
                  <Applications />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/apply/:jobId" 
              element={
                <ProtectedRoute>
                  <ApplicationForm />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/applications/:id" 
              element={
                <ProtectedRoute>
                  <ApplicationDetail />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/jobs" 
              element={
                <AdminRoute>
                  <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Jobs</h1>
                    <p className="text-gray-600">Admin job management interface coming soon...</p>
                  </div>
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/applications" 
              element={
                <AdminRoute>
                  <Applications />
                </AdminRoute>
              } 
            />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
        </Router>
      </ApplicationProvider>
    </NotificationProvider>
  );
}

export default App; 