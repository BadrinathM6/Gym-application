import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axiosInstance from './utils/axiosInstance';
import { Player } from '@lottiefiles/react-lottie-player';
import "../css/workoutDayPage.css";
import Mlogo from '../assets/logo 2.png';
import logo from '../assets/logo.png'
import FooterNav from "./FooterNav";
import loader from './Main Scene.json';
import dumbell from '../assets/office (1).svg'
import target from '../assets/arrow.svg'
const currentDay = 1;

const WorkoutChallenge = () => {
  // State for managing workout data
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [progress, setProgress] = useState(0);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [workoutDays, setWorkoutDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DumbellIcon = () => (
    <img
      src={dumbell}
      alt="Dumbbell Icon"
      width="24"
      height="24"
    />
  );
  
  const TargetIcon = () => (
    <img
      src={target}
      alt="Target Icon"
      width="20"
      height="20"
    />
  );

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
        setCurrentWeek(progressData.program.week_no);

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
        <div className="challenge-container">
          {/* Header and Progress Section */}
          <div className="challenge-header">
            <button className="back-button" onClick={() => window.history.back()}>
              <FaArrowLeft />
            </button>
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <h1 className="header-title">{program.name}</h1>
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
              src={Mlogo}
              alt="Logo"
              className="challenge-logo"
            />
            <p>{program.description}</p>
          </div>

          <div className="challenge-days">
            {workoutDays.map((day) => (
              <div
                key={day.id}
                className={`day-card ${day.day_number === currentDay ? "active" : ""}`}
              >
                <span>Week {day.week_number} - Day {day.day_number}</span>
                <button
                  className="day-button"
                  onClick={() => handleStartWorkout(day.id)}
                >
                  {day.day_number === currentDay ? <DumbellIcon/> : <TargetIcon/>}
                </button>
              </div>
            ))}
          </div>

          <div className="foot">
            <FooterNav/>
          </div>

        </div>
      )}
    </>
  );
};

export default WorkoutChallenge;