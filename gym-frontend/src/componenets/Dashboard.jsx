import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./utils/axiosInstance";
import "../css/Homepage.css";

// Lazy load components
const FooterNav = React.lazy(() => import("./FooterNav"));
import FooterSkeleton from "./FooterLoading";
import HomepageSkeleton from "./HomePageSkeleton";

// Import images with optimization in mind
import ChataiImg from "../assets/ai-icon.jpg";
import logo from "../assets/logo.webp";
import shedule from "../assets/gym-schedule.svg";
import search from "../assets/search.svg";
import userIcon from "../assets/user.svg";
import workoutIcon from "../assets/muscle.svg";
import settingsIcon from "../assets/settings.svg";

import bannerLaptop1 from "../assets/Banner1.png";
import bannerLaptop2 from "../assets/Banner2.png";
import bannerLaptop3 from "../assets/Banner3.png";
import bannerMobile1 from "../assets/1.png";
import bannerMobile2 from "../assets/2.png";
import bannerMobile3 from "../assets/3 (1).webp";

const HomePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Memoize navigation functions to prevent unnecessary re-renders
  const bannerImages = [
    {
      id: 1,
      mobileSrc: bannerMobile1 + "?c_scale,w_600,q_60,f_webp",
      laptopSrc: bannerLaptop1 + "?c_scale,w_1200,q_70,f_webp",
      alt: "Buffalo Gym Banner 1",
    },
    {
      id: 2,
      mobileSrc: bannerMobile2 + "?c_scale,w_600,q_60,f_webp",
      laptopSrc: bannerLaptop2 + "?c_scale,w_1200,q_70,f_webp",
      alt: "Buffalo Gym Banner 2",
    },
    {
      id: 3,
      mobileSrc: bannerMobile3 + "?c_scale,w_600,q_60,f_webp",
      laptopSrc: bannerLaptop3 + "?c_scale,w_1200,q_70,f_webp",
      alt: "Buffalo Gym Banner 3",
    },
  ];

  // Memoize navigation functions to prevent unnecessary re-renders
  const handleNavigate = useMemo(
    () => ({
      toHome: () => navigate("/"),
      toAIChat: () => navigate("/ai-chat"),
      toWorkout: () => navigate("/workout-week"),
      toProfile: () => navigate("/user-profile"),
      toSettings: () => navigate("/settings"),
    }),
    [navigate]
  );

  useEffect(() => {
    const fetchProgramData = async () => {
      try {
        // Fetch program data with performance optimizations
        const homeResponse = await axiosInstance.get("/home/", {
          params: {
            limit: 8, // Limit initial fetch
            optimize: true, // Backend optimization flag
          },
        });

        // Optimize program images
        const fetchedPrograms = homeResponse.data.programs
          .slice(0, 8)
          .map((program) => ({
            id: program.id,
            src: program.image_path + "?c_scale,w_300,q_70,f_webp", // Compressed, fixed width
            title: program.title,
            link: `/${program.title.toLowerCase().replace("_", "-")}`,
          }));
        setPrograms(fetchedPrograms);
      } catch (error) {
        console.error("Error fetching program data:", error);
        // Fallback to default/cached programs if needed
      } finally {
        setLoading(false);
      }
    };

    fetchProgramData();
  }, []);

  // Auto-sliding banner logic with performance optimization
  useEffect(() => {
    if (bannerImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [bannerImages]);

  // Banner slide navigation functions
  const prevSlide = React.useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? bannerImages.length - 1 : prev - 1
    );
  }, [bannerImages]);

  const nextSlide = React.useCallback(() => {
    setCurrentIndex((prev) =>
      prev === bannerImages.length - 1 ? 0 : prev + 1
    );
  }, [bannerImages]);

  // Render optimized component
  return (
    <>
      {loading ? (
        <HomepageSkeleton />
      ) : (
        <div className="homepage">
          <div className="header1">
            <div className="header-top">
              <div
                onClick={handleNavigate.toHome}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={logo}
                  alt="Gym Logo"
                  width={20}
                  height={20}
                  className="gym-logo"
                  loading="lazy"
                />
              </div>
              <h1 className="header-title">Buffalo Gym</h1>
              <div
                onClick={handleNavigate.toAIChat}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={ChataiImg}
                  alt="AI Chat Logo"
                  className="ai-logo"
                  loading="lazy"
                  width={50}
                  height={50}
                />
              </div>
            </div>

            <div className="header-bottom">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="Search for workouts..."
                  className="search-input"
                />
                <button className="search-button">
                  <img
                    src={search}
                    alt="search-icon"
                    className="search-icon"
                    loading="lazy"
                  />
                </button>
              </div>
              <button className="filter-button">
                <img
                  src={shedule}
                  alt="setting-icon"
                  className="filter-icon"
                  loading="lazy"
                />
              </button>
            </div>
          </div>

          <section className="custom-carousel relative overflow-hidden">
            <div className="carousel-container relative w-full h-48 md:h-96 lg:h-[20rem]">
              {bannerImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`carousel-slide absolute inset-0 transition-opacity duration-1000 ${
                    index === currentIndex
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                >
                  {/* Responsive image with mobile and laptop sources */}
                  <picture>
                    <source
                      media="(max-width: 768px)"
                      srcSet={image.mobileSrc}
                      type="image/jpeg"
                    />
                    <source
                      media="(min-width: 769px)"
                      srcSet={image.laptopSrc}
                      type="image/jpeg"
                    />
                    <img
                      src={image.laptopSrc}
                      alt={image.alt}
                      className="w-full h-full object-fill"
                      loading={index === currentIndex ? "eager" : "lazy"}
                      width={600}
                      height={360}
                    />
                  </picture>
                </div>
              ))}

              {/* Navigation Dots */}
              <div className="dots absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {bannerImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`dot w-3 h-3 rounded-full ${
                      index === currentIndex ? "bg-white" : "bg-gray-500"
                    }`}
                  />
                ))}
              </div>

              {/* Previous and Next Buttons */}
              <button
                onClick={prevSlide}
                className="prev absolute left-4 top-1/2 z-20 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  fill="none"
                  viewBox="0 0 24 24"
                  id="round-alt-arrow-left"
                >
                  <path
                    fill="#fff"
                    fill-rule="evenodd"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM14.0303 8.46967C14.3232 8.76256 14.3232 9.23744 14.0303 9.53033L11.5607 12L14.0303 14.4697C14.3232 14.7626 14.3232 15.2374 14.0303 15.5303C13.7374 15.8232 13.2626 15.8232 12.9697 15.5303L9.96967 12.5303C9.67678 12.2374 9.67678 11.7626 9.96967 11.4697L12.9697 8.46967C13.2626 8.17678 13.7374 8.17678 14.0303 8.46967Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="next absolute right-4 top-1/2 z-20 transform -translate-y-1/2 bg-transparent text-white p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  fill="none"
                  viewBox="0 0 24 24"
                  id="round-alt-arrow-right"
                >
                  <path
                    fill="#fff"
                    fill-rule="evenodd"
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM9.96967 8.46967C9.67678 8.76256 9.67678 9.23744 9.96967 9.53033L12.4393 12L9.96967 14.4697C9.67678 14.7626 9.67678 15.2374 9.96967 15.5303C10.2626 15.8232 10.7374 15.8232 11.0303 15.5303L14.0303 12.5303C14.3232 12.2374 14.3232 11.7626 14.0303 11.4697L11.0303 8.46967C10.7374 8.17678 10.2626 8.17678 9.96967 8.46967Z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
          </section>

          {/* Rest of the component remains largely the same */}
          <section className="section-buttons">
            <div
              className="button workout"
              onClick={handleNavigate.toWorkout}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img src={workoutIcon} alt="Workout Icon" />
              <span>Workout</span>
            </div>

            <div
              className="button user"
              onClick={handleNavigate.toProfile}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img src={userIcon} alt="User Icon" />
              <span>Profile</span>
            </div>

            <div
              className="button setting"
              onClick={handleNavigate.toSettings}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
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
                  <img
                    src={program.src}
                    alt={program.title}
                    className="program-image"
                    loading="lazy"
                    width={300}
                    height={180}
                  />
                  <h3>{program.title}</h3>
                </div>
              ))}
            </div>
          </section>

          {/* Footer */}
          <div className="foot">
            <Suspense fallback={<FooterSkeleton />}>
              <FooterNav />
            </Suspense>
          </div>
        </div>
      )}
    </>
  );
};

export default HomePage;
