import React, { useEffect } from "react";
import Lottie from "lottie-react";
import successAnimation from "../componenets/successfully-done.json";
import "./successAlert.css";

const SuccessAlert = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-alert-overlay">
      <div className="success-alert-container">
        <Lottie
          animationData={successAnimation}
          loop={false}
          autoplay={true}
          style={{ width: 200, height: 200 }}
        />
        <p className="success-message">{message}</p>
        <button className="success-close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default SuccessAlert;
