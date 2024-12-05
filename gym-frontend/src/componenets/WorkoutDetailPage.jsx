import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import YouTube from "react-youtube";
import axiosInstance from './utils/axiosInstance';
import '../css/WorkoutDetailPage.css';
import { FaArrowLeft } from "react-icons/fa";
import logo from '../assets/logo.png'
import loader from './Main Scene.json';
import FooterNav from "./FooterNav";
import { Player } from '@lottiefiles/react-lottie-player';

const ExercisePage = () => {
  const [exerciseData, setExerciseData] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [activeTab, setActiveTab] = useState("animation");
  const [duration, setDuration] = useState(20);
  const [loading, setLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [sets, setSets] = useState(0);
  const navigate = useNavigate();
  const { exerciseId } = useParams();

  useEffect(() => {
    // Fetch exercise details when component mounts
    const fetchExerciseDetails = async () => {
      try {
        setLoading(true)
        const response = await axiosInstance.get(`exercise/${exerciseId}/`);
        setExerciseData(response.data.exercise);
        setUserProgress(response.data.user_progress);
        
        // Set initial duration from user progress or exercise default
        setDuration(response.data.user_progress.exercise.default_duration || response.data.exercise.duration);
        setSets(response.data.user_progress.sets_completed || 0);
      } catch (error) {
        console.error("Error fetching exercise details:", error);
      }finally{
        setLoading(false)
      }
    };

    fetchExerciseDetails();
  }, [exerciseId]);

  const handleUpdateProgress = async () => {
    try {
      const progressData = {
        duration: duration,
        sets_completed: sets
      };

      const response = await axiosInstance.put(`exercise/${exerciseId}/update/`, progressData);
      setUserProgress(response.data.progress);
    } catch (error) {
      console.error("Error updating exercise progress:", error);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const videoOptions = {
    playerVars: {
      autoplay: 1,
    },
  };

  const handleIncrementDuration = () => {
    setDuration(prev => prev + 5);
  };

  const handleDecrementDuration = () => {
    setDuration(prev => Math.max(5, prev - 5));
  };

  const handleIncrementSets = () => {
    setSets(prev => prev + 1);
  };

  const handleDecrementSets = () => {
    setSets(prev => Math.max(0, prev - 1));
  };

  const handleImageError = () => {
    setImageLoadError(true);
    console.error("Image failed to load:", exerciseData.animation_path);
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
        <div className="exercise-page">
          <div className="challenge-header">
            <button className="back-button" onClick={() => window.history.back()}>
              <FaArrowLeft />
            </button>
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <h1 className="header-title">Buffalo</h1>
          </div>

          <div className="exercise-content">
            {activeTab === "animation" ? (
              <div className="animation-containers">
                {!imageLoadError ? (
                  exerciseData.animation_path.endsWith('.mp4') ? (
                    <video 
                      src={exerciseData.animation_path} 
                      className="workout-animation"
                      autoPlay 
                      loop 
                      muted 
                    />
                  ) : ['.gif', '.png', '.jpg', '.jpeg'].some(ext => exerciseData.animation_path.endsWith(ext)) ? (
                    <img 
                      src={exerciseData.animation_path} 
                      alt="Workout Animation" 
                      className="workout-animation"
                      onError={handleImageError}
                    />
                  ) : (
                    <div>No valid animation found</div>
                  )
                ) : (
                  <div className="image-error">
                    <p>Unable to load image. Please check the URL or network connection.</p>
                    <button 
                      className="replace-button"
                      onClick={() => setImageLoadError(false)}
                    >
                      Try Reloading
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="video-container">
                {exerciseData.demonstration_video_url && (
                  <YouTube
                    videoId={exerciseData.demonstration_video_url.split('v=')[1]}
                    opts={videoOptions}
                    className="youtube-player"
                  />
                )}
              </div>
            )}
          </div>

          <div className="exercise-tabs">
            <button
              className={`tab-button ${activeTab === "animation" ? "active" : ""}`}
              onClick={() => handleTabClick("animation")}
            >
              Animation
            </button>
            <button
              className={`tab-button ${activeTab === "howTo" ? "active" : ""}`}
              onClick={() => handleTabClick("howTo")}
            >
              How to do
            </button>
          </div>

          <div className="exercise-details">
            <h2>DURATION</h2>
            <div className="duration-control">
              <button onClick={handleDecrementDuration}>-</button>
              <span>{`00:${duration < 10 ? '0' : ''}${duration}`}</span>
              <button onClick={handleIncrementDuration}>+</button>
            </div>

            <h2>SETS</h2>
            <div className="sets-control">
              <button onClick={handleDecrementSets}>-</button>
              <span>{sets}</span>
              <button onClick={handleIncrementSets}>+</button>
            </div>

            <h2>INSTRUCTIONS</h2>
            <p>{exerciseData.description}</p>
          </div>

          <div className="footer-land">
            <span>{`${userProgress?.calories_burned?.toFixed(2) || 0} Calories Burned`}</span>
            <footer className="exercise-footer">
              <button onClick={() => navigate(-1)}>{"<<"}</button>
              <button onClick={handleUpdateProgress}>SAVE</button>
              <button>{">>"}</button>
            </footer>
          </div>

          <div className="foot">
            <FooterNav/>
          </div>
          
        </div>
      )}
    </>
  );
};

export default ExercisePage;