import React, { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from './utils/axiosInstance';
import "../css/foodSelectionPage.css";
import eggImg from '../assets/egg.jpg';


const TodayPlanPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [foods, setFoods] = useState([]);
    const [likedItems, setLikedItems] = useState({});
    const [selectedMealType, setSelectedMealType] = useState('BREAKFAST');
    const [dailyNutrition, setDailyNutrition] = useState({
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
    });

    const mealTypes = [
        { label: 'Breakfast', value: 'BREAKFAST' },
        { label: 'Lunch', value: 'LUNCH' },
        { label: 'Dinner', value: 'DINNER' },
        { label: 'Snacks', value: 'SNACKS' }
    ];

    useEffect(() => {
        fetchMealTypeFoods();
        fetchDailyNutrition();
    }, [selectedMealType]);

    const fetchMealTypeFoods = async () => {
        try {
            const response = await axiosInstance.get('meal-type-foods/', {
                params: { meal_type: selectedMealType }
            });
            const initialLikedState = response.data.reduce((acc, food) => {
                acc[food.id] = food.is_favorite;
                return acc;
            }, {});
            setLikedItems(initialLikedState);
        } catch (error) {
            console.error("Error fetching foods:", error);
        }
    };

    const fetchDailyNutrition = async () => {
        try {
            const response = await axiosInstance.get('daily-nutrition-summary/');
            setDailyNutrition({
                calories: response.data.total_calories,
                protein: response.data.total_protein,
                carbs: response.data.total_carbs,
                fat: response.data.total_fat
            });
        } catch (error) {
            console.error("Error fetching daily nutrition:", error);
        }
    };

    const toggleLike = async (foodId) => {
        try {
            await axiosInstance.post('favorite-foods/', { food_id: foodId });
            
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
            await axiosInstance.post('meal-type-foods/', { food_id: foodId });
            
            // Remove the consumed food from the list
            setFoods(prevFoods => prevFoods.filter(food => food.id !== foodId));
            
            // Refresh daily nutrition
            fetchDailyNutrition();
        } catch (error) {
            console.error("Error consuming food:", error);
        }
    };

    return (
        <div className="today-plan-page">
            <header className="plan-header">
                <IoArrowBack className="backward-arrow" onClick={() => navigate(-1)} />
                <input 
                    type="text" 
                    placeholder="Search" 
                    className="search-bar" 
                    // Add search functionality if needed
                />
            </header>

            <h2 className="plan-title">TODAY PLAN</h2>

            <div className="categories">
                {mealTypes.map((meal) => (
                    <button 
                        key={meal.value}
                        className={`category-button ${selectedMealType === meal.value ? 'active' : ''}`}
                        onClick={() => setSelectedMealType(meal.value)}
                    >
                        {meal.label}
                    </button>
                ))}
            </div>

            <div className="food-list1">
                {foods.map((food) => (
                    <div key={food.id} className="food-card1">
                        <img 
                            src={food.image_path || eggImg} 
                            alt={food.name} 
                            className="food-image" 
                        />
                        <div className="food-details1">
                            <h3>{food.name}</h3>
                            <div className="food-nutrients">
                                <h6>🔥 {food.calories} Cal</h6>
                                <h6>🥩 {food.protein}g Protein</h6>
                                <h6>🍞 {food.carbs}g Carbs</h6>
                                <h6>🧈 {food.fat}g Fat</h6>
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

            <footer className="plan-footer">
                <div className="footer-section">
                    <span>Calories</span>
                    <strong>{dailyNutrition.calories.toFixed(0)}</strong>
                </div>
                <div className="footer-section">
                    <span>Protein</span>
                    <strong>{dailyNutrition.protein.toFixed(1)}g</strong>
                </div>
                <div className="footer-section">
                    <span>Carbs</span>
                    <strong>{dailyNutrition.carbs.toFixed(1)}g</strong>
                </div>
                <div className="footer-section">
                    <span>Fat</span>
                    <strong>{dailyNutrition.fat.toFixed(1)}g</strong>
                </div>
            </footer>
        </div>
    );
};

export default TodayPlanPage;