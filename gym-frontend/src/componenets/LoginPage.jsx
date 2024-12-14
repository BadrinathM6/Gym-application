import React, { useState, useEffect, useCallback } from 'react';
import Lottie from 'react-lottie';
import { useNavigate, useLocation } from 'react-router-dom';
import athleteAnimation from './olympic-athlete.json';
import invalidCredentialsAnimation from './error1.json';
import axiosInstance from './utils/axiosInstance';
import '../css/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // State variables with more comprehensive management
  const [loginState, setLoginState] = useState({
    userId: '',
    password: '',
    isLoading: false,
    showAnimation: false,
    showSuccess: false,
    animationText: '',
    animationType: 'error', // Add animation type
    errors: {
      userId: '',
      password: ''
    }
  });

  // Lottie animation configurations
  const athleteOptions = {
    loop: false,
    autoplay: true,
    animationData: athleteAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
    speed: 1.5,
  };

  const invalidCredentialsOptions = {
    loop: false,
    autoplay: true,
    animationData: invalidCredentialsAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  // Check for session expiry or first-time access
  useEffect(() => {
    // Check if there's a session expired state
    const sessionExpiredMessage = location.state?.sessionExpired;
    if (sessionExpiredMessage) {
      // Prevent default navigation behavior
      const newState = { ...location.state };
      delete newState.sessionExpired;
      window.history.replaceState(newState, '');

      // Set animation for session expiry
      setLoginState(prev => ({
        ...prev,
        showAnimation: true,
        showSuccess: false,
        animationText: 'Session expired. Please log in again.',
        animationType: 'error',
        isLoading: false
      }));
    }
  }, [location.state]);

  // Comprehensive form validation
  const validateForm = useCallback(() => {
    const newErrors = {
      userId: loginState.userId.trim() ? '' : 'User ID is required',
      password: loginState.password.trim() ? '' : 'Password is required'
    };

    setLoginState(prev => ({
      ...prev,
      errors: newErrors
    }));

    // Clear errors after 2 seconds
    if (newErrors.userId || newErrors.password) {
      setTimeout(() => {
        setLoginState(prev => ({
          ...prev,
          errors: { userId: '', password: '' }
        }));
      }, 2000);
    }

    return !newErrors.userId && !newErrors.password;
  }, [loginState.userId, loginState.password]);

  // Handle login process
  const handleLogin = async (e) => {
    // Prevent default form submission
    e.preventDefault();
    e.stopPropagation();

    // Reset previous states
    setLoginState(prev => ({
      ...prev,
      isLoading: true,
      showAnimation: false,
      showSuccess: false,
      animationText: '',
      animationType: 'error'
    }));

    // Validate form
    if (!validateForm()) {
      setLoginState(prev => ({ 
        ...prev, 
        isLoading: false 
      }));
      return;
    }

    try {
      const response = await axiosInstance.post('/login/', {
        user_id: loginState.userId,
        password: loginState.password,
      }, {
        // Prevent automatic error handling
        validateStatus: function (status) {
          return status >= 200 && status < 500; 
        }
      });

      // Handle different response scenarios
      if (response.data.access) {
        // Successful login
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);

        setLoginState(prev => ({
          ...prev,
          showSuccess: true,
          showAnimation: true,
          animationText: 'Login Successful! Redirecting...',
          animationType: 'success',
          isLoading: false
        }));

        // Navigate after short delay
        setTimeout(() => {
          const from = location.state?.from?.pathname || '/genderselection';
          navigate(from, { replace: true });
        }, 2500);
      } else {
        // Handle login failure
        const errorMessage = response.data.error || 
          response.data.detail || 
          'Login failed. Please check your credentials.';

        setLoginState(prev => ({
          ...prev,
          showAnimation: true,
          showSuccess: false,
          animationText: errorMessage,
          animationType: 'error',
          isLoading: false,
          userId: '',
          password: ''
        }));

        // Keep error visible
        setTimeout(() => {
          setLoginState(prev => ({
            ...prev,
            showAnimation: false,
            animationText: ''
          }));
        }, 3000);
      }
    } catch (err) {
      // Network or unexpected errors
      const errorMessage = 
        err.response?.data?.error || 
        err.response?.data?.detail || 
        'An unexpected error occurred. Please try again.';

      setLoginState(prev => ({
        ...prev,
        showAnimation: true,
        showSuccess: false,
        animationText: errorMessage,
        animationType: 'error',
        isLoading: false,
        userId: '',
        password: ''
      }));

      // Keep error visible
      setTimeout(() => {
        setLoginState(prev => ({
          ...prev,
          showAnimation: false,
          animationText: ''
        }));
      }, 3000);
    }
  };

  // Input change handler
  const handleInputChange = (field, value) => {
    setLoginState(prev => ({
      ...prev,
      [field]: value,
      errors: { ...prev.errors, [field]: '' }
    }));
  };

  return (
    <div className="login-page">
      <header className="header">
        <div className="navbar">
          <img src="/src/assets/logo.png" alt="Logo" className="Logo" />
          <h1 className="gym-name">Buffalo GYM</h1>
        </div>
      </header>
      
      <div className="content">
        <div className={`login-form ${loginState.showAnimation ? 'showing-animation' : ''}`}>
          <div className="form-header">
            {!loginState.showAnimation && (
              <>
                <img src="/src/assets/logo.png" alt="Logo" className="Mlogo" />
                <h2 className='welcome-text'>Welcome To New Team</h2>
              </>
            )}
          </div>
          
          <div className="animation-container">
            {loginState.showAnimation && (
              <>
                <Lottie
                  options={loginState.animationType === 'success' ? athleteOptions : invalidCredentialsOptions}
                  height={120}
                  width={120}
                  isStopped={!loginState.showAnimation}
                  isPaused={false}
                />
                <p className={`animation-text ${loginState.animationType === 'success' ? 'success' : 'error'}`}>
                  {loginState.animationText}
                </p>
              </>
            )}
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="User ID"
              value={loginState.userId}
              onChange={(e) => handleInputChange('userId', e.target.value)}
              className={loginState.errors.userId ? 'error-input' : ''}
            />
            {loginState.errors.userId && (
              <span className="error-message">{loginState.errors.userId}</span>
            )}
            
            <input
              type="password"
              placeholder="Password"
              value={loginState.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={loginState.errors.password ? 'error-input' : ''}
            />
            {loginState.errors.password && (
              <span className="error-message">{loginState.errors.password}</span>
            )}
            
            <button 
              type="submit" 
              disabled={loginState.isLoading}
              onClick={(e) => {
                e.preventDefault();
                handleLogin(e);
              }}
            >
              {loginState.isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;