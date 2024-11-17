import React, { useState } from 'react';
import Lottie from 'react-lottie';
import { useNavigate } from 'react-router-dom';
import athleteAnimation from './olympic-athlete.json';
import axiosInstance from './utils/axiosInstance';
import '../css/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [animationText, setAnimationText] = useState('');

  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: athleteAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
    speed: 1.5,
  };

  const animateText = (text, callback) => {
    setAnimationText(text);
    if (callback) setTimeout(callback, 100);
  };

  const resetAnimations = () => {
    setShowAnimation(false);
    setShowSuccess(false);
    setAnimationText('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    resetAnimations();
    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/login/', {
        user_id: userId,
        password: password,
      });

      if (response.data.access) {
        localStorage.setItem('accessToken', response.data.access);
        localStorage.setItem('refreshToken', response.data.refresh);

        setShowSuccess(true);
        setShowAnimation(true);
        animateText('Login Successful! Redirecting...', () => {
          setTimeout(() => {
            navigate('/');
          }, 2500);
        });
      }
    } catch (err) {
      setShowAnimation(true);
      animateText(err.response?.data?.error || 'Login failed. Please try again.');

      setTimeout(() => {
        resetAnimations();
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <header className="header">
        <h1 className="gym-name">Buffalo GYM</h1>
        <div className="navbar">
          <img src="/src/assets/logo.png" alt="Logo" className="logo" />
        </div>
      </header>
      
      <div className="content">
        <div className={`login-form ${showAnimation ? 'showing-animation' : ''}`}>
          <div className="form-header">
            <img src="/src/assets/logo.png" alt="Logo" className="Mlogo" />
            <h2 className='welcome-text'>Welcome To New Team</h2>
          </div>
          
          <div className="animation-container">
            {showAnimation && (
              <>
                <Lottie
                  options={defaultOptions}
                  height={120}
                  width={120}
                  isStopped={!showAnimation}
                  isPaused={false}
                />
                <p className={`animation-text ${showSuccess ? 'success' : 'error'}`}>
                  {animationText}
                </p>
              </>
            )}
          </div>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;