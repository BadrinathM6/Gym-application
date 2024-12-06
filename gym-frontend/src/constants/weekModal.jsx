import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import { useNavigate } from 'react-router-dom';
import targetEvaluation from '../componenets/target-evaluation.json';
import './modalStyles.css';

const WeekCompletedModal = ({ calories, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/workout-week');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleNextWeek = () => {
    navigate('/workout-week');
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <Lottie
          animationData={targetEvaluation}
          loop={false}
          autoplay={true}
          style={{ width: 300, height: 300 }}
        />
        <h2>Week Completed!</h2>
        <p>You burned {calories.toFixed(0)} calories this week</p>
        <button 
          className="modal-close-button"
          onClick={handleNextWeek}
        >
          Next Week
        </button>
      </div>
    </div>
  );
};

export default WeekCompletedModal;