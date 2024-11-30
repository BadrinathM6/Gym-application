import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";
import axiosInstance from './utils/axiosInstance';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../css/Homepage.css";
import FooterNav from "./FooterNav";
import ChataiImg from '../assets/ai-icon.jpg'
import logo from '../assets/logo.png'

const HomePage = () => {
  const navigate = useNavigate();
  const [bannerImages, setBannerImages] = useState([]);
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    const fetchHomePageData = async () => {
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
    <div className="homepage">
      {/* Header - same as before */}
      <header className="header1">
        <div className="header-left">
          <h1 className="brand-name">Buffalo</h1>
        </div>
        <div className="header-right">
          <div className="search-bar-container">
            <input type="text" className="search-bar" placeholder="Search here" />
            <button className="search-icon">🔍</button>
          </div>
          <button 
            className="chat-ai-icon-button" 
            onClick={() => navigate("/ai-chat")}
          >
            <img 
              src={ChataiImg} 
              alt="Chat AI" 
              className="chat-ai-icon" 
            />
          </button>
        </div>
      </header>

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
  );
};

export default HomePage;