import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginPage from './componenets/LoginPage';
import Dashboard from './componenets/Dashboard';
import GenderSelectionPage from './componenets/GenderSelection';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    return !!token;
  };

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AuthenticatedRoute = ({ element: Component, ...rest }) => {
  return (
    <ProtectedRoute>
      <Component {...rest} />
    </ProtectedRoute>
  );
};

const App = () => {
  const location = useLocation(); // This is now within the Router context

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AuthenticatedRoute element={Dashboard} />} />
        <Route path="/genderselection" element={<AuthenticatedRoute element={GenderSelectionPage} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
