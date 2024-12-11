import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import male from "../assets/male.png";
import female from "../assets/female.png";
import loader from "./Main Scene.json";
import { pageVariants, cardVariants } from "../constants/animations";
import "../css/GenderSelection.css";

const GenderSelectionPage = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserGender = async () => {
      try {
        const response = await axiosInstance.get("/user/");
        if (response.data.gender) {
          setIsExiting(true);
          setTimeout(() => {
            navigate("/");
          }, 500);
        }
      } catch (err) {
        if (err.response?.status !== 401) {
          setError("Failed to fetch user data. Please try again.");
          console.error("Error checking user gender:", err);
        }
      }
    };

    checkUserGender();
  }, [navigate]);

  const handleGenderSelection = (gender) => {
    if (gender !== selectedGender) {
      setSelectedGender(gender);
    }
  };

  const handleNextClick = async () => {
    if (!selectedGender) {
      alert("Please select a gender!");
      return;
    }

    setLoading(true);
    setError(null);

    const genderMap = {
      Male: "M",
      Female: "F",
    };

    try {
      await axiosInstance.put("/user/", {
        gender: genderMap[selectedGender],
      });

      setIsExiting(true);
      setTimeout(() => {
        navigate("/age");
      }, 500);
    } catch (err) {
      console.error("Error updating gender:", err);

      if (err.response?.status === 400) {
        setError("Invalid gender selection. Please try again.");
      } else if (err.response?.status === 405) {
        setError("Server configuration error. Please contact support.");
      } else if (err.response?.status !== 401) {
        setError(
          err.response?.data?.error ||
            "Failed to update gender. Please try again."
        );
      }
      setLoading(false);
    }
  };

  return (
    <>
      {loading || isExiting ? (
        <div className="loading-container">
          <Player
            autoplay
            loop
            src={loader}
            style={{ width: 200, height: 200 }}
          />
        </div>
      ) : (
        <motion.div
          className="gender-selection-container"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Select Your Gender
          </motion.h1>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {error}
            </motion.div>
          )}

          <div className="gender-options">
            <motion.div
              className={`gender-card ${
                selectedGender === "Male" ? "selected" : ""
              }`}
              onClick={() => handleGenderSelection("Male")}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.img
                src={male}
                alt="Male"
                className="gender-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              />
              <h2 className="gender-title">Male</h2>
            </motion.div>

            <motion.div
              className={`gender-card ${
                selectedGender === "Female" ? "selected" : ""
              }`}
              onClick={() => handleGenderSelection("Female")}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.img
                src={female}
                alt="Female"
                className="gender-image"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              />
              <h2 className="gender-title">Female</h2>
            </motion.div>
          </div>

          <motion.button
            className={`next-button ${loading ? "loading" : ""}`}
            onClick={handleNextClick}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {loading ? "Updating..." : "Next"}
          </motion.button>
        </motion.div>
      )}
    </>
  );
};

export default GenderSelectionPage;
