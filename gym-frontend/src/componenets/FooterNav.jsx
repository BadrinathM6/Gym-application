import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/FooterNav.css";
import homeIcon from "../assets/house.svg"; // Add your home icon image
import workoutIcon from "../assets/user.svg"; // Add your workout icon image
import settingsIcon from "../assets/settings.svg"; // Add your settings icon image

const FooterNav = () => {
  const navigate = useNavigate();

  return (
    <div className="footer-nav">
      <button className="footer-button" onClick={() => navigate("/home")}>
        <img src={homeIcon} alt="Home" />
      </button>
      <button className="footer-button" onClick={() => navigate("/workout")}>
        <img src={workoutIcon} alt="Workout" />
      </button>
      <button className="footer-button" onClick={() => navigate("/settings")}>
        <img src={settingsIcon} alt="Settings" />
      </button>
    </div>
  );
};

export default FooterNav;