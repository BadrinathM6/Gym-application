import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import axiosInstance from './utils/axiosInstance';
import "slick-carousel/slick/slick.css";
import { Player } from '@lottiefiles/react-lottie-player';
import "slick-carousel/slick/slick-theme.css";
import "../css/Homepage.css";
import FooterNav from "./FooterNav";
import ChataiImg from '../assets/ai-icon.jpg'
import logo from '../assets/logo.png'
import shedule from '../assets/gym-schedulea.svg'
import search from '../assets/search.svg'
import userIcon from "../assets/user.svg"; 
import workoutIcon from "../assets/muscle.svg"; 
import settingsIcon from "../assets/settings.svg";
import loader from './Main Scene.json';

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bannerImages, setBannerImages] = useState([]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchHomePageData = async () => {
       setLoading(true);
      try {
        const response = await axiosInstance.get('/home/');
        
        // Transform banners
        const fetchedBanners = response.data.banners.map((banner, index) => ({
          id: banner.id,
          src: banner.image_path,
          alt: banner.title,
          subtitle: banner.subtitle
        }));
        setBannerImages(fetchedBanners);

        // Transform programs
        const fetchedPrograms = response.data.programs.map((program, index) => ({
          id: program.id,
          src: program.image_path,
          title: program.title,
          link: `/${program.category.toLowerCase().replace('_', '-')}`
        }));
        setPrograms(fetchedPrograms);
      } catch (error) {
        console.error("Error fetching home page data:", error);
        // Optionally set default images/programs or show an error message
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageData();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
  };

  return (
    <>
    {(loading) ? (
        <div className="loading-container">
          <Player
            autoplay
            loop
            src={loader}
            style={{ width: 200, height: 200 }}
          />
        </div>
    ) : (
        <div className="homepage">
          {/* Header - same as before */}
          <div className="header1">
            <div className="header-top">
              <div onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                <img src={logo} alt="Gym Logo" className="gym-logo" />
              </div>
              <h1 className="header-title">Buffalo Gym</h1>     
              <div onClick={() => navigate("/ai-chat")} style={{ cursor: "pointer" }}>
                <img src={ChataiImg} alt="AI Chat Logo" className="ai-logo" />
              </div>
            </div>
            <div className="header-bottom">
              <div className="search-bar">
                <input type="text" placeholder="Search for workouts..." className="search-input" />
                <button className="search-button">
                  <img src={search} alt="search-icon" className="search-icon"/>
                </button>
              </div>
              <button className="filter-button">
                <img src={shedule} alt="setting-icon" className="filter-icon"/>
              </button>
            </div>
          </div>

          {/* Banner Section */}
          <section className="banner1">
            <Slider {...sliderSettings}>
              {bannerImages.map((image) => (
                <div
                  key={image.id}
                  className="slide"
                  onClick={() => navigate(image.link)}
                >
                  <img src={image.src} alt={image.alt} className="banner1-image" />
                  <h2 className="banner1-text">{image.alt}</h2>
                  {image.subtitle && <p>{image.subtitle}</p>}
                </div>
              ))}
            </Slider>
          </section>

          <section className="section-buttons">
            <div className="button workout" 
                onClick={() => navigate("/workout-week")}
                style={{ cursor: "pointer", display: "flex", alignItems: "center",}}
            >
              <img src={workoutIcon} alt="Workout Icon"/>
              <span>Workout</span>
            </div>

            <div className="button user"
              onClick={() => navigate("/user-profile")} 
              style={{ cursor: "pointer", display: "flex", alignItems: "center",}}
            >
              <img src={userIcon} alt="user Icon" />
              <span>Profile</span>
            </div>
            
            <div className="button setting"
              onClick={() => navigate("/settings")}
              style={{ cursor: "pointer", display: "flex", alignItems: "center",}}
            >
              <img src={settingsIcon} alt="Settings Icon" />
              <span>Settings</span>
            </div>
            
          </section>

          {/* Programs Section */}
          <section className="programs">
            <h2>Our Programs</h2>
            <div className="program-grid">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="program-card"
                  onClick={() => navigate(program.link)}
                >
                  <div className="heart-icon">🤍</div>
                  <img src={program.src} alt={program.title} className="program-image" />
                  <h3>{program.title}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="foot">
            <FooterNav/>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;