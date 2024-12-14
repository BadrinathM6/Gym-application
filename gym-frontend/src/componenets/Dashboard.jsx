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

import bannerLaptop1 from "../assets/1.webp";
import bannerLaptop2 from "../assets/2.webp";
import bannerLaptop3 from "../assets/3.webp";
import bannerMobile1 from "../assets/1 (1).webp";
import bannerMobile2 from "../assets/2 (1).webp";
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
      mobileSrc: bannerMobile1,
      laptopSrc: bannerLaptop1,
      alt: "Buffalo Gym Banner 1",
    },
    {
      id: 2,
      mobileSrc: bannerMobile2,
      laptopSrc: bannerLaptop2,
      alt: "Buffalo Gym Banner 2",
    },
    {
      id: 3,
      mobileSrc: bannerMobile3,
      laptopSrc: bannerLaptop3,
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
      }, 5000);

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
      {/* Add preload for critical images */}
      {bannerImages.length > 0 && (
        <link rel="preload" href={bannerImages[currentIndex]} as="image" />
      )}

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

          <section className="banner1 relative overflow-hidden">
            <div className="relative w-full h-48 md:h-96 lg:h-[20rem]">
              {bannerImages.map((image, index) => (
                <div
                  key={image.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentIndex ? "opacity-100" : "opacity-0"
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
                      className="w-full h-full object-cover"
                      loading="lazy"
                      width={1280}
                      height={720}
                      fetchpriority={index === currentIndex ? "high" : "low"}
                    />
                  </picture>
                </div>
              ))}

              {/* Optional: Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {bannerImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentIndex ? "bg-white" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              {/* Optional: Previous and Next Buttons */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                ←
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full"
              >
                →
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
