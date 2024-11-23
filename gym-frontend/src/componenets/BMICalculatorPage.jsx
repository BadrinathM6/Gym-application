import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import axiosInstance from './utils/axiosInstance';
import "../css/BmiCalculation.css";
import WeightImg from '../assets/weightBmi.jpg';
import HeightImg from '../assets/heightBmi.jpg';
import loader from './Main Scene.json';
import { pageVariants } from '../constants/animations'

const BMIPage = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [bmi, setBMI] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const navigate = useNavigate();

  const inputVariants = {
    hover: { scale: 1.02 },
    tap: { scale: 0.98 }
  };

  useEffect(() => {
    const fetchPhysicalProfile = async () => {
      try {
        const response = await axiosInstance.get('/physical-profile/');
        if (response.status === 200) {
          const { height, weight, bmi, bmi_category } = response.data;
          setHeight(height);
          setWeight(weight);
          setBMI(bmi);
          setBmiCategory(bmi_category);
        }
      } catch (err) {
        if (err.response?.status !== 404) {
          setError("Error fetching profile data");
          console.error("Error fetching physical profile:", err);
        }
      }
    };

    fetchPhysicalProfile();
  }, []);

  const handleCalculateBMI = async () => {
    if (!weight || !height) {
      setError("Please enter both weight and height!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post('/physical-profile/', {
        weight: parseFloat(weight),
        height: parseFloat(height)
      });

      if (response.status === 201) {
        const { bmi, bmi_category } = response.data;
        setBMI(bmi);
        setBmiCategory(bmi_category);
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred while calculating BMI");
      console.error("Error calculating BMI:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (!bmi) {
      setError("Please calculate your BMI before proceeding!");
      return;
    }

    setIsExiting(true);
    setTimeout(() => {
      navigate("/foodtypeselection");
    }, 500);
  };

  return (
    <>
      {(loading || isExiting) ? (
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
          className="bmi-page-container"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <motion.h1
            className="bmi-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Calculate Your BMI
          </motion.h1>

          <div className="bmi-section">
            <motion.div
              className="bmi-input-section"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <img src={WeightImg} alt="Weight" className="bmi-image" />
              <motion.input
                type="number"
                placeholder="Weight (kg)"
                className="bmi-input"
                value={weight}
                onChange={(e) => {
                  setWeight(e.target.value);
                  setError("");
                }}
                variants={inputVariants}
                whileHover="hover"
                whileTap="tap"
              />
            </motion.div>

            <motion.div
              className="bmi-input-section"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <img src={HeightImg} alt="Height" className="bmi-image" />
              <motion.input
                type="number"
                placeholder="Height (cm)"
                className="bmi-input"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  setError("");
                }}
                variants={inputVariants}
                whileHover="hover"
                whileTap="tap"
              />
            </motion.div>
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

          <motion.button
            className="calculate-btn"
            onClick={handleCalculateBMI}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {loading ? "Calculating..." : "Calculate BMI"}
          </motion.button>

          {bmi && (
            <motion.div
              className="bmi-result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.h2 className="bmi-result">Your BMI: {bmi}</motion.h2>
              <motion.p className="bmi-category">Category: {bmiCategory}</motion.p>
            </motion.div>
          )}

          <motion.button
            className="next-btn2"
            onClick={handleNext}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Next
          </motion.button>
        </motion.div>
      )}
    </>
  );
};

export default BMIPage;