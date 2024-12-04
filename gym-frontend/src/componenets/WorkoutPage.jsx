import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import '../css/WorkoutPage.css'; 
import { FaHeart ,FaArrowLeft } from 'react-icons/fa';
import axiosInstance from './utils/axiosInstance';
import { Player } from '@lottiefiles/react-lottie-player';
import Week1 from '../assets/week1.jpg' 
import Week2 from '../assets/week2.jpg' 
import Week3 from '../assets/week3.jpg' 
import Week4 from '../assets/week4.jpg' 
import Week5 from '../assets/week5.jpg'
import search from '../assets/search.svg'
import Logo from '../assets/logo.png'
import FooterNav from "./FooterNav";
import loader from './Main Scene.json';

const WorkoutPage = () => {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch workout categories
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get('/workout-categories/');
        setCategories(response.data);
      } catch (err) {
        console.error('Error fetching workout categories:', err);
      }
    };

    // Fetch workouts
    const fetchWorkouts = async () => {
      try {
        setLoading(true);
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        
        const response = await axiosInstance.get('/workouts/', { params });
        setWorkouts(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching workouts:', err);
        setError('Failed to load workouts');
        setLoading(false);
      }finally{
        setLoading(false);
      }
    };

    fetchCategories();
    fetchWorkouts();
  }, [selectedCategory]);

  const filteredWorkouts = workouts.filter(workout => 
    workout.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workout.week.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
    {(loading) ? (
        <div className="loading-container">
          <Player
            autoplay
            loop
            src={loader}
            style={{ width: 200, height: 200 }}
          />
        </div>
    ) : (
        <div className="workout-page">
          <header className="workout-header">
            <button className="back-button" onClick={() => navigate('/')}>
              <FaArrowLeft />
            </button>
            <div className="logo-container">
              <img src={Logo} alt="Logo" className="logo" />
            </div>
            <h1 className="header-title">BUFFALO GYM</h1>
          </header>
          
          <div className="workout-search">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                className="search-bar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="search-icon-container">
                <img src={search} alt="search-icon" className="search-icon" />
              </div>
            </div>
            <button className="plan-button">PLAN OVER</button>
          </div>
          
          <div className="workout-categories-container">
            <div className="workout-categories">
              {categories.map((category) => (
                <button 
                  key={category} 
                  className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="workout-list">
            {loading ? (
              <div className="loading">Loading workouts...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : filteredWorkouts.length > 0 ? (
              filteredWorkouts.map((workout, index) => (
                <WorkoutCard key={workout.id} workout={workout} navigate={navigate} programId={workout.id} />
              ))
            ) : (
              <div className="no-workouts">No workouts found</div>
            )}
          </div>
          
          <footer className="workout-footer">
            <div className="calories-info">
              <p>Calories</p>
              <p>🔥 0 Min</p>
            </div>
            <button className="top-up-button">Top Up +</button>
          </footer>

          <div className="foot">
            <FooterNav/>
          </div>

        </div>
      )}
    </>
  );
};

const WorkoutCard = ({ workout, navigate, programId }) => {
  const [isFavorite, setIsFavorite] = useState(workout.is_favorite || false);
  // const navigate = useNavigate();

  const toggleFavorite = async () => {
    try {
      const response = await axiosInstance.post('/toggle-favorite/', { 
        workout_id: workout.id 
      });
      setIsFavorite(response.data.is_favorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const truncateDescription = (text, wordLimit) => {
    const words = text.split(" ");
    return words.length > wordLimit ? words.slice(0, wordLimit).join(" ") + "..." : text;
  };

  return (
    <div className="workout-card">
      <img 
        src={workout.image || (
          workout.week === 'Week 1' ? Week1 :
          workout.week === 'Week 2' ? Week2 :
          workout.week === 'Week 3' ? Week3 :
          workout.week === 'Week 4' ? Week4 :
          workout.week === 'Week 5' ? Week5 : null
        )} 
        alt={workout.title} 
        className="workout-image" 
      />
      <div className="workout-details">
        <h3>{workout.name}</h3>
        <p
          className="workout-description"
          data-full-description={workout.description}
        >
          {truncateDescription(workout.description, 3)}
        </p>
        <div className="workout-actions">
          <button className="start-button" onClick={() => navigate(`/workout-day/${programId}`)}>Start</button>
        </div>
        <span className="workout-week">{workout.week}</span>
      </div>
      <button
        className={`favorite-button ${isFavorite ? "favorite-active" : ""}`}
        onClick={toggleFavorite}
      >
        <FaHeart />
      </button>
    </div>
  );
};

export default WorkoutPage;