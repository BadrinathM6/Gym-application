import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import YouTube from "react-youtube";
import axiosInstance from "./utils/axiosInstance";
import "../css/WorkoutDetailPage.css";
import { FaArrowLeft } from "react-icons/fa";
import logo from "../assets/logo.png";
import loader from "./Main Scene.json";
import FooterNav from "./FooterNav";
import { Player } from "@lottiefiles/react-lottie-player";
import CongratsModal from "../constants/congratsModal";
import WeekCompletedModal from "../constants/weekModal";

const ExercisePage = () => {
  const navigate = useNavigate();
  const { exerciseId } = useParams();

  // State Management
  const [exerciseData, setExerciseData] = useState(null);
  const [userProgress, setUserProgress] = useState(null);
  const [weekWorkouts, setWeekWorkouts] = useState([]);
  const [currentWorkoutIndex, setCurrentWorkoutIndex] = useState(0);

  const [activeTab, setActiveTab] = useState("animation");
  const [duration, setDuration] = useState(20);
  const [sets, setSets] = useState(0);
  const [totalCalories, setTotalCalories] = useState(0);

  const [loading, setLoading] = useState(true);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [showCongratsModal, setShowCongratsModal] = useState(false);
  const [weekCompletedModal, setWeekCompletedModal] = useState(false);

  // Fetch Workouts and Exercise Details
  useEffect(() => {
    const fetchWorkoutDetails = async () => {
      try {
        setLoading(true);
        // Fetch week's workouts
        const weekResponse = await axiosInstance.get("workouts/");
        console.log(weekResponse.data);
        setWeekWorkouts(weekResponse.data);

        // Find current workout index
        const currentIndex = weekResponse.data.findIndex(
          (workout) => workout.id === parseInt(exerciseId)
        );
        setCurrentWorkoutIndex(currentIndex);

        // Fetch specific exercise details
        const exerciseResponse = await axiosInstance.get(
          `exercise/${exerciseId}/`
        );
        setExerciseData(exerciseResponse.data.exercise);
        setUserProgress(exerciseResponse.data.user_progress);

        // Set initial duration and sets
        const initialDuration =
          exerciseResponse.data.user_progress?.exercise?.default_duration ??
          exerciseResponse.data.exercise?.default_duration ??
          20;

        setDuration(initialDuration);

        const initialSets =
          exerciseResponse.data.user_progress?.exercise?.default_set ??
          exerciseResponse.data.exercise?.default_set ??
          0;

        setSets(initialSets);
      } catch (error) {
        console.error("Error fetching workout details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutDetails();
  }, [exerciseId]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Calories Calculation
  const calculateTotalCalories = (exerciseData, sets, duration) => {
    if (!exerciseData) return 0;

    const caloriesFromSets =
      sets > 0 ? (exerciseData.calories_per_set || 0) * sets : 0;

    const caloriesFromDuration =
      duration > 0
        ? (exerciseData.calories_per_minute || 0) * (duration / 60)
        : 0;

    return caloriesFromSets + caloriesFromDuration;
  };

  // Update calories when sets or duration change
  useEffect(() => {
    if (exerciseData) {
      const calculatedCalories = calculateTotalCalories(
        exerciseData,
        sets,
        duration
      );
      setTotalCalories(calculatedCalories);
    }
  }, [sets, duration, exerciseData]);

  // Update Progress Handler
  const handleUpdateProgress = async () => {
    try {
      const progressData = {
        duration: duration,
        sets_completed: sets,
        calories_burned: totalCalories,
        progress_percentage: calculateProgressPercentage(),
        total_workout_time: duration
      };

      const response = await axiosInstance.put(
        `exercise/${exerciseId}/update/`,
        progressData
      );
      setUserProgress(response.data.progress);

      // Show congratulations modal
      setShowCongratsModal(true);

      // Check if this is the last workout of the week
      if (currentWorkoutIndex === weekWorkouts.length - 1) {
        const weekTotalCalories = weekWorkouts.reduce(
          (total, workout) => total + (workout.calories_burned || 0),
          0
        );
        setWeekCompletedModal(true);  
      }
    } catch (error) {
      console.error("Error updating exercise progress:", error);
    }
  };

  const calculateProgressPercentage = () => {
    const defaultSets = exerciseData.default_reps || 10;
    const progressPercentage = (sets / defaultSets) * 100;
    return Math.min(Math.max(progressPercentage, 0), 100);
  };

  // Navigation Handlers
  const handleNextWorkout = () => {
    if (
      weekWorkouts.length > 0 &&
      currentWorkoutIndex < weekWorkouts.length - 1
    ) {
      const nextWorkout = weekWorkouts[currentWorkoutIndex + 1];
      navigate(`/exercise/${nextWorkout.id}`);
    }
  };

  const handlePreviousWorkout = () => {
    if (currentWorkoutIndex > 0) {
      const prevWorkout = weekWorkouts[currentWorkoutIndex - 1];
      navigate(`/exercise/${prevWorkout.id}`);
    }
  };

  // Tab and UI Handlers
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleImageError = () => {
    setImageLoadError(true);
    console.error("Image failed to load:", exerciseData.animation_path);
  };

  // Increment/Decrement Handlers
  const handleIncrementDuration = () => setDuration((prev) => prev + 5);
  const handleDecrementDuration = () =>
    setDuration((prev) => Math.max(5, prev - 5));
  const handleIncrementSets = () => setSets((prev) => prev + 1);
  const handleDecrementSets = () => setSets((prev) => Math.max(0, prev - 1));

  return (
    <>
      {loading ? (
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
          {/* Header */}
          <header className="challenge-header">
            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft />
            </button>
            <div className="logo-container">
              <img src={logo} alt="Logo" className="logo" />
            </div>
            <h1 className="header-title">BUFFALO GYM</h1>
          </header>

          {/* Exercise Content */}
          <div className="exercise-content">
            {activeTab === "animation" ? (
              <div className="animation-containers">
                {!imageLoadError ? (
                  exerciseData.animation_path.endsWith(".mp4") ? (
                    <video
                      src={exerciseData.animation_path}
                      className="workout-animation"
                      autoPlay
                      loop
                      muted
                    />
                  ) : [".gif", ".png", ".jpg", ".jpeg"].some((ext) =>
                      exerciseData.animation_path.endsWith(ext)
                    ) ? (
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
                    <p>
                      Unable to load image. Please check the URL or network
                      connection.
                    </p>
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
                    videoId={
                      exerciseData.demonstration_video_url.split("v=")[1]
                    }
                    opts={{ playerVars: { autoplay: 1 } }}
                    className="youtube-player"
                  />
                )}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="exercise-tabs">
            <button
              className={`tab-button ${
                activeTab === "animation" ? "active" : ""
              }`}
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

          {/* Exercise Details */}
          <div className="exercise-details">
            {duration > 0 && (
              <div className="duration-section">
                <h2 className="duration-text">DURATION</h2>
                <div className="duration-control">
                  <button onClick={handleDecrementDuration}>-</button>
                  <span>{formatDuration(duration)}</span>
                  <button onClick={handleIncrementDuration}>+</button>
                </div>
              </div>
            )}

            {sets > 0 && (
              <div className="sets-section">
                <h2>SETS</h2>
                <div className="sets-control">
                  <button onClick={handleDecrementSets}>-</button>
                  <span>{sets}</span>
                  <button onClick={handleIncrementSets}>+</button>
                </div>
              </div>
            )}

            <div className="instructions-section">
              <h2>INSTRUCTIONS</h2>
              <p>{exerciseData.description}</p>
            </div>
          </div>

          {/* Footer */}
          <div className="footer-land">
            <p>🔥 {userProgress.calories_burned.toFixed(0)} Cal Burned</p>
            <footer className="exercise-footer">
              <button
                className={`previous-button ${
                  currentWorkoutIndex === 0 ? "non-touchable" : ""
                }`}
                onClick={handlePreviousWorkout}
                disabled={currentWorkoutIndex === 0}
              >
                {"<<"}
              </button>
              <button className="save-button" onClick={handleUpdateProgress}>
                Save
              </button>
              <button
                className={`next-button ${
                  currentWorkoutIndex === weekWorkouts.length - 1
                    ? "non-touchable"
                    : ""
                }`}
                onClick={handleNextWorkout}
                disabled={currentWorkoutIndex === weekWorkouts.length - 1}
              >
                {">>"}
              </button>
            </footer>
          </div>

          {showCongratsModal && (
            <CongratsModal
              calories={userProgress.calories_burned}
              onClose={() => setShowCongratsModal(false)}
            />
          )}

          {weekCompletedModal && (
            <WeekCompletedModal
              calories={totalCalories}
              onClose={() => setWeekCompletedModal(false)}
            />
          )}

          {/* Footer Navigation */}
          <div className="foot">
            <FooterNav />
          </div>
        </div>
      )}
    </>
  );
};

export default ExercisePage;
