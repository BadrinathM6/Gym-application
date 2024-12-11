import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Player } from "@lottiefiles/react-lottie-player";
import axiosInstance from "./utils/axiosInstance";
import "../css/AgePage.css";
import AgebgImg from "../assets/agepage.jpg";
import { FaAngleRight } from "react-icons/fa";
import loader from "./Main Scene.json";
import { pageVariants, cardVariants } from "../constants/animations";

const AgePage = () => {
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAge = async () => {
      try {
        const response = await axiosInstance.get("/update-age/");
        if (response.data.age) {
          setAge(response.data.age.toString());
        }
      } catch (err) {
        console.error("Error fetching age:", err);
      }
    };

    fetchAge();
  }, []);

  const handleNext = async () => {
    setError("");

    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum)) {
      setError("Please enter your age.");
      return;
    }

    if (ageNum < 13 || ageNum > 100) {
      setError("Please enter a valid age between 13 and 100.");
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.put("/update-age/", {
        age: ageNum,
      });

      setIsExiting(true);
      setTimeout(() => {
        navigate("/bodytypeselection");
      }, 500);
    } catch (err) {
      console.error("Error updating age:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred while saving your age. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+$/.test(value)) {
      setAge(value);
      setError("");
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
          className="age-page-container"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.header
            className="age-header"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <motion.img
              src={AgebgImg}
              alt="Age Options Banner"
              className="age-banner"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            />
          </motion.header>

          <motion.main
            className="age-main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <motion.div
              className="age-card"
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <motion.p
                className="age-prompt"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                How old are you?
              </motion.p>

              <motion.input
                type="number"
                placeholder="Enter your age"
                className="age-input"
                value={age}
                onChange={handleAgeChange}
                min="13"
                max="100"
                disabled={loading}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              />

              {error && (
                <motion.p
                  className="error-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {error}
                </motion.p>
              )}

              <motion.button
                className={`next-btn1 ${loading ? "loading" : ""}`}
                onClick={handleNext}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <FaAngleRight />
              </motion.button>
            </motion.div>
          </motion.main>
        </motion.div>
      )}
    </>
  );
};

export default AgePage;
