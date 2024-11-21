import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player'; // Importing Lottie Player
import loader from './componenets/Main Scene.json'; // Importing your Lottie JSON
import LoginPage from './componenets/LoginPage';
import Dashboard from './componenets/Dashboard';
import GenderSelectionPage from './componenets/GenderSelection';
import VegAndNonVegPage from './componenets/foodTypeSelection';

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
  const [isLoading, setIsLoading] = React.useState(true);

  // Simulating loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); // Example: 3-second loader
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Player
          autoplay
          loop
          src={loader}
          style={{ width: 300, height: 300 }}
        />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<AuthenticatedRoute element={Dashboard} />} />
        <Route path="/genderselection" element={<AuthenticatedRoute element={GenderSelectionPage} />} />
        <Route path="/foodtypeselection" element={<AuthenticatedRoute element={VegAndNonVegPage} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
