import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import axiosInstance from "./utils/axiosInstance";
import { pageVariants, cardVariants } from "../constants/animations";
import "../css/foodTypeSelection.css";
import FoodPlanning from "../assets/FoodPlanning.jpg";
import VegetarianImg from "../assets/Vegitarian.jpg";
import NonVegImg from "../assets/NonVeg.jpg";
import VegranImg from "../assets/Vegan.jpg";
import Logo from "../assets/logo.png";
import loader from "./Main Scene.json";

const VegAndNonVegPage = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  // Fetch existing dietary preferences on component mount
  useEffect(() => {
    const fetchDietaryPreferences = async () => {
      try {
        const response = await axiosInstance.get("/dietary-preferences/");
        // Map backend diet types to frontend options
        const dietTypeMapping = {
          VEG: "vegetarian",
          NON_VEG: "non-vegetarian",
          VEGAN: "vegan",
        };
        setSelectedOption(dietTypeMapping[response.data.diet_type] || "");
      } catch (err) {
        // 404 is expected if no preferences exist yet
        if (err.response?.status !== 404) {
          setError("Failed to fetch dietary preferences");
        }
      }
    };

    fetchDietaryPreferences();
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleNext = async () => {
    if (!selectedOption) {
      alert("Please select an option before proceeding.");
      return;
    }

    // Map frontend options to backend diet types
    const dietTypeMapping = {
      vegetarian: "VEG",
      "non-vegetarian": "NON_VEG",
      vegan: "VEGAN",
    };

    try {
      setLoading(true);
      await axiosInstance.post("/dietary-preferences/", {
        diet_type: dietTypeMapping[selectedOption],
      });

      setIsExiting(true);
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (err) {
      setError("Failed to save dietary preferences");
      alert("Failed to save dietary preferences. Please try again.");
    } finally {
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
          className="veg-nonveg-container"
          variants={pageVariants}
          initial="initial"
          animate={isExiting ? "exit" : "animate"}
        >
          <motion.img
            src={Logo}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="title"
          ></motion.img>

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

          <motion.h2
            className="tittle2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            What Type Food You Prefer For ?
          </motion.h2>

          <main className="main-content">
            <motion.div
              className="food-planning-banner"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <img
                src={FoodPlanning}
                alt="Food planning"
                className="banner-image"
              />
            </motion.div>

            <div className="options-container">
              {[
                { type: "vegetarian", img: VegetarianImg, label: "Vegetarian" },
                {
                  type: "non-vegetarian",
                  img: NonVegImg,
                  label: "Non Vegetarian",
                },
                { type: "vegan", img: VegranImg, label: "Vegan" },
              ].map((option, index) => (
                <motion.div
                  key={option.type}
                  className={`option-card ${
                    selectedOption === option.type ? "selected" : ""
                  }`}
                  onClick={() => handleOptionChange(option.type)}
                  variants={cardVariants}
                  whileHover="hover"
                  whileTap="tap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <motion.img
                    src={option.img}
                    alt={option.label}
                    className="gender-image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  />
                  <h3>{option.label}</h3>
                  <div className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={selectedOption === option.type}
                      readOnly
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </main>

          <footer className="footer">
            <motion.button
              className={`next-btn ${loading ? "loading" : ""}`}
              onClick={handleNext}
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {loading ? "Saving..." : "GET STARTED"}
            </motion.button>
          </footer>
        </motion.div>
      )}
    </>
  );
};

export default VegAndNonVegPage;
