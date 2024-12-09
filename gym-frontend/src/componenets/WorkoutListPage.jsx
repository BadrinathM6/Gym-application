import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import Lottie from "lottie-react";
import axiosInstance from './utils/axiosInstance';
import headerBgImg from "../assets/headerbg.png";
import '../css/WorkoutListPage.css';
import { FaArrowLeft } from "react-icons/fa";
import logo from '../assets/logo.png'
import FooterNav from "./FooterNav";
import loader from './Main Scene.json';
import { Player } from '@lottiefiles/react-lottie-player';

const DayWorkoutPage = () => {
  const [workoutDay, setWorkoutDay] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { dayId } = useParams();

  useEffect(() => {
    const fetchWorkoutDayProgress = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`workout-day/${dayId}/progress/`);
        
        setWorkoutDay(response.data.workout_day);
        setExercises(response.data.exercises);
        setTotalCaloriesBurned(response.data.total_calories_burned);
      } catch (error) {
        console.error("Error fetching workout day progress:", error);
      }finally{
        setLoading(false)
      }
    };

    fetchWorkoutDayProgress();
  }, [dayId]);

  const formatDuration = (durationInSeconds) => {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    
    if (minutes > 0 && seconds > 0) {
      return `${minutes}min ${seconds}s`;
    } else if (minutes > 0) {
      return `${minutes}min`;
    } else {
      return `${seconds}s`;
    }
  };
  

  const handleStartWorkout = async () => {
    try {
      const progressData = exercises.reduce((acc, exercise) => {
        acc[exercise.exercise.id] = {
          duration: exercise.duration,
          sets_completed: exercise.sets_completed
        };
        return acc;
      }, {});

      const response = await axiosInstance.post(`workout-day/${dayId}/progress/`, progressData);
      
      // Navigate to a summary or next page after completing workout
      navigate('/workout-summary', { 
        state: { 
          totalCalories: response.data.total_calories_burned,
          exercises: response.data.exercises 
        }
      });
    } catch (error) {
      console.error("Error completing workout:", error);
    }
  };

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
        <div className="page-container">

          <div className="challenge-headers">
            <button className="back-button" onClick={() => window.history.back()}>
              <FaArrowLeft />
            </button>
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <h1 className="header-title">Buffalo</h1>
          </div>

          {/* Header Section */}
          <div className="headers">
            <div className="header-content">
              <h1 className="day-title">Day {workoutDay.day_number}</h1>
              <p className="workout-info">9 mins • {exercises.length} Workouts</p>
            </div>
            <div className="header-images"></div>
          </div>

          {/* Workout List Section */}
          <div className="workout-container">
            <div className="workout-header2">
              <p className="workout-summary">
                {totalCaloriesBurned.toFixed(2)} Calories • {exercises.length} Workouts
              </p>
            </div>
            
            {exercises.map((exercise, index) => (
              <div 
                className="workout-item" 
                key={exercise.exercise.id}
                onClick={() => navigate(`/exercise/${exercise.exercise.id}`)}
              >
                <div className="icon-placeholder">
                  {exercise.exercise.animation_path.endsWith('.mp4') ? (
                    <video 
                      src={exercise.exercise.animation_path} 
                      className="workout-animation" 
                      autoPlay 
                      loop 
                      muted 
                    />
                  ) : ['.gif', '.png', '.jpg', '.jpeg'].some(ext => exercise.exercise.animation_path.endsWith(ext))
                  ? (
                    <img 
                      src={exercise.exercise.animation_path} 
                      alt="Workout Animation" 
                      className="workout-animation" 
                    />
                  ) : (
                    <div>No valid animation found</div>
                  )}
                </div>

                <div className="workout-details">
                  <p className="workout-name">{exercise.exercise.name}</p>
                  <p className="workout-metrics">
                    {exercise.exercise.default_duration > 0 
                      ? formatDuration(exercise.exercise.default_duration) 
                      : `${exercise.exercise.default_set} sets`}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Start Button */}
          <div className="workout-button">
            <button 
              className="start-buttons"
              onClick={handleStartWorkout}
            >
              START WORKOUT
            </button>
          </div>
          
          <div className="foot">
            <FooterNav/>
          </div>

        </div>
      )}
    </>
  );
};

export default DayWorkoutPage;