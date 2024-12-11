import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import axiosInstance from "./utils/axiosInstance";
import "../css/bodyTypeSelection.css";
import loader from "./Main Scene.json";
import skinnyimg from "../assets/skinnyimg.jpg";
import IdealImg from "../assets/ideal.jpg";
import FlabbyImg from "../assets/flaby.jpg";
import BannerImage from "../assets/BodySelectionTypeBanner.jpg";
import { pageVariants, cardVariants } from "../constants/animations";

const BodyTypeSelectionPage = () => {
  const [selectedBodyType, setSelectedBodyType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const handleSelection = (bodyType) => {
    setSelectedBodyType(bodyType);
    setError("");
  };

  const handleNext = async () => {
    if (!selectedBodyType) {
      setError("Please select a body type before proceeding.");
      return;
    }

    setLoading(true);
    try {
      const bodyTypeMapping = {
        Skinny: "SKINNY",
        Ideal: "IDEAL",
        Flabby: "FLABBY",
      };

      const response = await axiosInstance.post("/body-type/", {
        body_type: bodyTypeMapping[selectedBodyType],
        fitness_goal: getFitnessGoal(bodyTypeMapping[selectedBodyType]),
      });

      if (response.status === 201) {
        setIsExiting(true);
        setTimeout(() => {
          navigate("/bmi-calculator");
        }, 500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      console.error("Error saving body type:", err);
    } finally {
      setLoading(false);
    }
  };

  const getFitnessGoal = (bodyType) => {
    switch (bodyType) {
      case "SKINNY":
        return "Build muscle mass and increase strength";
      case "FLABBY":
        return "Lose fat and tone muscles";
      case "IDEAL":
        return "Maintain current physique and improve overall fitness";
      default:
        return "";
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
          className="body-type-container"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.img
            src={BannerImage}
            alt="Banner"
            className="banner-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          />

          <motion.h1
            className="title"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            What's your body type?
          </motion.h1>

          <div className="body-type-options">
            {[
              { type: "Skinny", image: skinnyimg },
              { type: "Ideal", image: IdealImg },
              { type: "Flabby", image: FlabbyImg },
            ].map((item, index) => (
              <motion.div
                key={item.type}
                className={`body-type-card ${
                  selectedBodyType === item.type ? "selected" : ""
                }`}
                onClick={() => handleSelection(item.type)}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <motion.img
                  src={item.image}
                  alt={item.type}
                  className="body-type-image"
                />
                <h2 className="body-type-title">{item.type}</h2>
              </motion.div>
            ))}
          </div>

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

          <footer className="footer">
            <motion.button
              className="next-btn"
              onClick={handleNext}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              GET STARTED
            </motion.button>
          </footer>
        </motion.div>
      )}
    </>
  );
};

export default BodyTypeSelectionPage;
