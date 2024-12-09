import React, { useState } from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import foodVlogger from '../componenets/food-vlogger.json'; // Make sure to import the Lottie JSON file
import './foodConsumption.css';

const FoodConsumptionSuccess = ({ calories, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="food-consumption-success-overlay">
      <div className="food-consumption-success-modal">
        <Player
          autoplay
          loop
          src={foodVlogger}
          style={{ width: 250, height: 250 }}
        />
        <div className="success-message">
          <h2>Great Job!</h2>
          <p>You've successfully consumed {calories} calories.</p>
          <p>Keep pushing towards your fitness goals!</p>
          <button 
            className="close-button" 
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodConsumptionSuccess;