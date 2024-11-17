import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './componenets/LoginPage'
import Dashboard from './componenets/Dashboard'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token; // Returns true if token exists
  };

  if (!isAuthenticated()) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Auth Provider Component
const AuthenticatedRoute = ({ element: Component, ...rest }) => {
  return (
    <ProtectedRoute>
      <Component {...rest} />
    </ProtectedRoute>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route 
          path="/" 
          element={
            <AuthenticatedRoute element={Dashboard} />
          } 
        />

        {/* Redirect any unknown routes to dashboard if authenticated, otherwise to login */}
        <Route 
          path="*" 
          element={
            <Navigate to="/" replace />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;