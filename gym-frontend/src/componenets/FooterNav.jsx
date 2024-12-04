import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/FooterNav.css";
import homeIcon from "../assets/house.svg"; // Add your home icon image
import profileIcon from "../assets/user.svg"; // Add your workout icon image
import settingsIcon from "../assets/settings.svg";
import workoutIcon from '../assets/dumbbell.svg'; // Add your settings icon image
import foodIcon from '../assets/food.svg'

const FooterNav = () => {
  const navigate = useNavigate();

  return (
    <div className="footer-nav">
      <button className="footer-button" onClick={() => navigate("/home")}>
        <img src={homeIcon} alt="Home" />
      </button>
      <button className="footer-button" onClick={() => navigate("/workout-week")}>
        <img src={workoutIcon} alt="workout" />
      </button>
      <button className="footer-button" onClick={() => navigate("/food")}>
        <img src={foodIcon} alt="food" />
      </button>
      <button className="footer-button" onClick={() => navigate("/user-profile")}>
        <img src={profileIcon} alt="profile" />
      </button>
      <button className="footer-button" onClick={() => navigate("/settings")}>
        <img src={settingsIcon} alt="Settings" />
      </button>
    </div>
  );
};

export default FooterNav;