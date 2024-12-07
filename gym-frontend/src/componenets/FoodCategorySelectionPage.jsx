import React, { useState, useEffect } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import "../css/FoodCategoryPage.css";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axiosInstance from './utils/axiosInstance';
import vegImg from '../assets/foodPageVeg.jpg';
import nonvegImg from '../assets/foodPageNonVeg.jpg';
import veganImg from '../assets/foodPageVegan.jpg';

const FoodPage = () => {
    const navigate = useNavigate();
    const [foodCategories, setFoodCategories] = useState([]);
    const [likedItems, setLikedItems] = useState({});

    useEffect(() => {
        fetchFoodCategories();
    }, []);

    const fetchFoodCategories = async () => {
        try {
            const response = await axiosInstance.get('food-categories/');
            
            // Map backend categories to frontend display
            const mappedCategories = response.data.map((category, index) => ({
                id: category.id,
                type: category.name,
                description: category.description,
                date: new Date().toLocaleDateString(),
                image: getImageForCategory(category.name),
                Link: '/today'
            }));

            setFoodCategories(mappedCategories);
        } catch (error) {
            console.error("Error fetching food categories:", error);
        }
    };

    const getImageForCategory = (categoryName) => {
        const categoryImages = {
            'Vegetarian': vegImg,
            'Non-Vegetarian': nonvegImg,
            'Vegan': veganImg
        };
        return categoryImages[categoryName] || vegImg;
    };

    const toggleLike = async (id) => {
        try {
            await axiosInstance.post('favorite-foods/', { food_id: id });
            
            setLikedItems((prev) => ({
                ...prev,
                [id]: !prev[id],
            }));
        } catch (error) {
            console.error("Error toggling favorite:", error);
        }
    };

    return (
        <div className="food-page">
            <header className="food-header">
                <IoArrowBack className="backward-arrow" onClick={() => navigate(-1)} />
                <h1>Buffalo</h1>
            </header>
            <div className="food-list">
                {foodCategories.map((food) => (
                    <div 
                        key={food.id} 
                        className="food-card" 
                        onClick={() => navigate(food.Link, { 
                            state: { 
                                categoryId: food.id, 
                                categoryName: food.type 
                            } 
                        })}
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
                                <AiOutlineHeart style={{ color: "gray", fontSize: "24px" }} />
                            )}
                        </div>
                    </div>
                ))}
            </div>
            <footer className="food-footer">
                <button className="open-now-button">Open Now</button>
            </footer>
        </div>
    );
};

export default FoodPage;