import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/FooterNav.css";
import homeIcon from "../assets/house.svg";
import profileIcon from "../assets/user.svg"; 
import settingsIcon from "../assets/settings (1).svg";
import workoutIcon from "../assets/dumbbell.svg"; 
import foodIcon from "../assets/food.svg";

const FooterNav = () => {
  const navigate = useNavigate();

  return (
    <div className="footer-nav">
      <button className="footer-button" onClick={() => navigate("/")}>
        <img src={homeIcon} alt="Home" loading="lazy" />
      </button>
      <button
        className="footer-button"
        onClick={() => navigate("/workout-week")}
      >
        <img src={workoutIcon} alt="workout" loading="lazy"/>
      </button>
      <button className="footer-button" onClick={() => navigate("/foodpage")}>
        <img src={foodIcon} alt="food" loading="lazy" />
      </button>
      <button
        className="footer-button"
        onClick={() => navigate("/user-profile")}
      >
        <img src={profileIcon} alt="profile" loading="lazy" />
      </button>
      <button className="footer-button" onClick={() => navigate("/settings")}>
        <img src={settingsIcon} alt="Settings" loading="lazy"/>
      </button>
    </div>
  );
};

export default FooterNav;
