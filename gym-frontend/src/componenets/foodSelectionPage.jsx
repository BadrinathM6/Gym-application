import React, { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa"
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import "../css/foodSelectionPage.css";
import eggImg from "../assets/egg.jpg";
import Logo from "../assets/logo.png";
import search from "../assets/search.svg";
import loader from './Main Scene.json';
import FooterNav from "./FooterNav";
import { Player } from '@lottiefiles/react-lottie-player';
import FoodConsumptionSuccess from "../constants/foodConsumedAnimation";

const TodayPlanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [foods, setFoods] = useState([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [likedItems, setLikedItems] = useState({});
  const [selectedMealType, setSelectedMealType] = useState("BREAKFAST");
  const [foodQuantities, setFoodQuantities] = useState({});
  const [searchTerm, setSearchTerm] = useState(""); // Added searchTerm state
  const [dailyNutrition, setDailyNutrition] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  const mealTypes = [
    { label: "Breakfast", value: "BREAKFAST" },
    { label: "Lunch", value: "LUNCH" },
    { label: "Dinner", value: "DINNER" },
    { label: "Snacks", value: "SNACKS" },
  ];

  useEffect(() => {
    fetchMealTypeFoods();
    fetchDailyNutrition();
  }, [selectedMealType]);

  const fetchMealTypeFoods = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("meal-type-foods/", {
        params: { meal_type: selectedMealType },
      });
      const initialLikedState = response.data.reduce((acc, food) => {
        acc[food.id] = food.is_favorite;
        return acc;
      }, {});

      const initialQuantityState = response.data.reduce((acc, food) => {
        acc[food.id] = 1; // Default quantity to 1
        return acc;
      }, {});
      setFoods(response.data);
      setLikedItems(initialLikedState);
      setFoodQuantities(initialQuantityState);
    } catch (error) {
      console.error("Error fetching foods:", error);
    }finally{
      setLoading(false);
    }
  };

  const fetchDailyNutrition = async () => {
    try {
      const response = await axiosInstance.get("daily-nutrition-summary/");
      setDailyNutrition({
        calories: response.data.total_calories,
        protein: response.data.total_protein,
        carbs: response.data.total_carbs,
        fat: response.data.total_fat,
      });
    } catch (error) {
      console.error("Error fetching daily nutrition:", error);
    }
  };

  const toggleLike = async (foodId) => {
    try {
      await axiosInstance.post("favorite-foods/", { food_id: foodId });

      setLikedItems((prev) => ({
        ...prev,
        [foodId]: !prev[foodId],
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const consumeFood = async (foodId) => {
    try {
      const foodToConsume = foods.find(food => food.id === foodId);
      const quantity = foodQuantities[foodId] || 1;
      
      const response = await axiosInstance.post("meal-type-foods/", { 
        food_id: foodId,
        serving_size: quantity
      });

      const caloriesConsumed = response.data.calories_consumed;

      // Set calories for the success animation
      setConsumedCalories(caloriesConsumed);
      
      // Show success animation
      setShowSuccessAnimation(true);

      setFoods((prevFoods) => prevFoods.filter((food) => food.id !== foodId));
      setFoodQuantities((prev) => ({...prev, [foodId]: 1}));

      fetchDailyNutrition();
    } catch (error) {
      console.error("Error consuming food:", error);
    }
  };

  const handleQuantityChange = (foodId, value) => {
    // Remove non-numeric characters and convert to number
    const numericValue = value === '' ? 1 : parseInt(value.replace(/\D/g, ''), 10);
    
    setFoodQuantities((prev) => ({
      ...prev,
      [foodId]: Math.max(1, numericValue) // Ensure quantity is at least 1
    }));
  };

  const incrementQuantity = (foodId) => {
    setFoodQuantities((prev) => ({
      ...prev,
      [foodId]: (prev[foodId] || 1) + 1
    }));
  };

  const decrementQuantity = (foodId) => {
    setFoodQuantities((prev) => ({
      ...prev,
      [foodId]: Math.max(1, (prev[foodId] || 1) - 1)
    }));
  };

  // Filter foods based on searchTerm
  const filteredFoods = foods.filter((food) =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {loading ? (
        <div className="loading-container">
          <Player
            autoplay
            loop
            src={loader}
            style={{ width: 200, height: 200 }}
          />
        </div>
      ) : (
        <div className="today-plan-page">
          <header className="workout-header">
            <button className="back-button" onClick={() => window.history.back()}>
              <FaArrowLeft />
            </button>
            <div className="logo-container">
              <img src={Logo} alt="Logo" className="logo" />
            </div>
            <h1 className="header-title">BUFFALO GYM</h1>
          </header>

          <div className="workout-searches">
            <div className="search-containers">
              <input
                type="text"
                placeholder="Search"
                className="search-bars"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="search-button">
                <img src={search} alt="search-icon" className="search-icon"/>
              </button>
            </div>
          </div>

          <h2 className="plan-title">TODAY PLAN</h2>

          <div className="categories">
            {mealTypes.map((meal) => (
              <button
                key={meal.value}
                className={`category-button ${
                  selectedMealType === meal.value ? "active" : ""
                }`}
                onClick={() => setSelectedMealType(meal.value)}
              >
                {meal.label}
              </button>
            ))}
          </div>

          <div className="plan-footer">
            <div className="footer-section">
              <span>Kcal: </span>
              <strong>{dailyNutrition.calories.toFixed(0)}</strong>
            </div>
            <div className="footer-section">
              <span>Protein: </span>
              <strong>{dailyNutrition.protein.toFixed(1)}g</strong>
            </div>
            <div className="footer-section">
              <span>Carbs: </span>
              <strong>{dailyNutrition.carbs.toFixed(1)}g</strong>
            </div>
            <div className="footer-section">
              <span>Fat: </span>
              <strong>{dailyNutrition.fat.toFixed(1)}g</strong>
            </div>
          </div>

          <div className="food-list1">
            {filteredFoods.map((food) => (
              <div key={food.id} className="food-card1">
                <div className="food-image-quantity-container">
                  <img
                    src={food.image_path || eggImg}
                    alt={food.name}
                    className="food-image"
                  />
                  <div className="quantity-container">
                    <div className="quantity-control">
                      <button 
                        className="quantity-button" 
                        onClick={() => decrementQuantity(food.id)}
                      >
                        <FaMinus />
                      </button>
                      <input 
                        type="text" 
                        className="quantity-input"
                        value={foodQuantities[food.id] || 1}g
                        onChange={(e) => handleQuantityChange(food.id, e.target.value)}
                        style={{
                        }}
                      />
                      <button 
                        className="quantity-button" 
                        onClick={() => incrementQuantity(food.id)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="food-details1">
                  <h3>{food.name}</h3>
                  <div className="food-nutrients">
                    <h6> ► {food.calories} calories ({food.serving_size}).</h6>
                    <h6> ► {food.protein}g proteins ({food.serving_size}).</h6>
                    <h6> ► {food.carbs}g carbs ({food.serving_size}).</h6>
                    <h6> ► {food.fat}g fat ({food.serving_size}).</h6>
                  </div>
                </div>

                <div className="food-info">
                  <div className="like-and-consume">
                    <div
                      className="like-icon"
                      onClick={() => toggleLike(food.id)}
                    >
                      {likedItems[food.id] ? (
                        <AiFillHeart style={{ color: "red", fontSize: "20px" }} />
                      ) : (
                        <AiOutlineHeart style={{ color: "gray", fontSize: "20px" }} />
                      )}
                    </div>
                    <button
                      className="consume-button"
                      onClick={() => consumeFood(food.id)}
                    >
                      Consume
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="foot">
            <FooterNav/>
          </div>

          {showSuccessAnimation && (
            <FoodConsumptionSuccess 
              calories={consumedCalories}
              onClose={() => setShowSuccessAnimation(false)}
            />
          )}

        </div>
      )}
    </>
  );
};

export default TodayPlanPage;
