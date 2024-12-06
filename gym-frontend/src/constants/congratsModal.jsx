import React, { useEffect } from 'react';
import Lottie from 'lottie-react';
import targetEvaluation from '../componenets/target-evaluation.json';
import './modalStyles.css';

const CongratsModal = ({ calories, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <Lottie
          animationData={targetEvaluation}
          loop={false}
          autoplay={true}
          style={{ width: 300, height: 300 }}
        />
        <h2>Congratulations!</h2>
        <p>You burned {calories.toFixed(0)} calories</p>
        <button 
          className="modal-close-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default CongratsModal;