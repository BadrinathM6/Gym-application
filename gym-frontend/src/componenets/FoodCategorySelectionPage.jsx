import React, { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import "../css/FoodCategoryPage.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import axiosInstance from "./utils/axiosInstance";
import vegImg from "../assets/foodPageVeg.jpg";
import nonvegImg from "../assets/foodPageNonVeg.jpg";
import veganImg from "../assets/foodPageVegan.jpg";
import Logo from "../assets/logo.png";
import Mlogo from "../assets/logo 2.png";
import FooterNav from "./FooterNav";
import loader from "./Main Scene.json";

const FoodPage = () => {
  const navigate = useNavigate();
  const [foodCategories, setFoodCategories] = useState([]);
  const [likedItems, setLikedItems] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFoodCategories();
  }, []);

  const fetchFoodCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("food-categories/");

      // Map backend categories to frontend display
      const mappedCategories = response.data.map((category, index) => ({
        id: category.id,
        type: category.name,
        description: category.description,
        date: new Date().toLocaleDateString(),
        image: getImageForCategory(category.name),
        Link: "/today",
      }));

      setFoodCategories(mappedCategories);
    } catch (error) {
      console.error("Error fetching food categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const getImageForCategory = (categoryName) => {
    const categoryImages = {
      Vegetarian: vegImg,
      "Non-Vegetarian": nonvegImg,
      Vegan: veganImg,
    };
    return categoryImages[categoryName] || vegImg;
  };

  const toggleLike = async (id) => {
    try {
      console.log("Toggling favorite for food_id:", id);
      await axiosInstance.post("favorite-foods/", { food_id: id });

      setLikedItems((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

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
        <div className="food-page">
          <header className="workout-header">
            <button
              className="back-button"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft />
            </button>
            <div className="logo-container">
              <img src={Logo} alt="Logo" className="logo" />
            </div>
            <h1 className="header-title">BUFFALO GYM</h1>
          </header>

          <div className="challenge-intro">
            <img src={Mlogo} alt="Logo" className="challenge-logo" />
          </div>

          <div className="food-list">
            {foodCategories.map((food) => (
              <div
                key={food.id}
                className="food-card"
                onClick={() =>
                  navigate(food.Link, {
                    state: {
                      categoryId: food.id,
                      categoryName: food.type,
                    },
                  })
                }
              >
                <img src={food.image} alt={food.type} className="food-image" />
                <div className="food-details">
                  <h2>{food.type}</h2>
                  <p>{food.description}</p>
                  <span className="food-date">📅 {food.date}</span>
                </div>
                <div
                  className="like-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(food.id);
                  }}
                >
                  {likedItems[food.id] ? (
                    <AiFillHeart style={{ color: "red", fontSize: "24px" }} />
                  ) : (
                    <AiOutlineHeart
                      style={{ color: "gray", fontSize: "24px" }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          <footer className="food-footer">
            <button className="open-now-button">Open Now</button>
          </footer>

          <div className="foots">
            <FooterNav />
          </div>
        </div>
      )}
    </>
  );
};

export default FoodPage;
