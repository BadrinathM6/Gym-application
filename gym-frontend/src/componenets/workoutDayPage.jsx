import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axiosInstance from './utils/axiosInstance';
import "../css/workoutDayPage.css";
import logo from '../assets/logo.png';

const WorkoutChallenge = () => {
  // State for managing workout data
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [workoutDays, setWorkoutDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch program progress and days
  useEffect(() => {
    const fetchProgramDetails = async () => {
      try {

        const validProgramId = parseInt(programId, 10);
        
        if (isNaN(validProgramId)) {
          throw new Error('Invalid Program ID');
        }

        // Fetch program progress
        const progressResponse = await axiosInstance.get(`/workout-program/${programId}/progress/`);
        const progressData = progressResponse.data;
        setProgress(progressData.progress_percentage);
        setCurrentWeek(progressData.current_week);

        // Fetch workout days for current week
        const daysResponse = await axiosInstance.get(`/workout-program/${programId}/week/${currentWeek}/days/`);
        setWorkoutDays(daysResponse.data);
        setProgram(progressData.program);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchProgramDetails();
  }, [programId, currentWeek]);

  // Start workout for a specific day
  const handleStartWorkout = async (dayId) => {
    try {
      await axiosInstance.post(`/workout-day/${dayId}/start/`);
      // Navigate to workout detail or update UI
    } catch (err) {
      console.error("Failed to start workout", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading workout details</div>;

  return (
    <div className="challenge-container">
      {/* Header and Progress Section */}
      <div className="challenge-header">
        <button className="back-button" onClick={() => window.history.back()}>
          <FaArrowLeft />
        </button>
        <h1>{program.name}</h1>
      </div>
      <div className="progress-container">
        <p>{program.total_weeks - currentWeek} Weeks Left</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p>{progress.toFixed(0)}%</p>
      </div>
      {/* Challenge Intro */}
      <div className="challenge-intro">
        <img
          src={logo}
          alt="Logo"
          className="challenge-logo"
        />
        <p>{program.description}</p>
      </div>
      {/* Workout Days */}
      <div className="challenge-days">
        {workoutDays.map((day, index) => (
          <div
            key={day.id}
            className={`day-card ${index === day.day_number - 1 ? "active" : ""}`}
          >
            <span>Week {day.week_number} - Day {day.day_number}</span>
            <button 
              className="day-button" 
              onClick={() => handleStartWorkout(day.id)}
            >
              {index === day.day_number - 1 ? "🔘" : "➡️"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutChallenge;